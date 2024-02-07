import { PoolClient } from "pg";
import database from "..";
import { ConflictError, NotFoundError } from "../../utils/errors";
import { calculateChange } from "../../utils/coins";

export enum Role {
    BUYER = "buyer",
    SELLER = "seller",
}

export interface UserItem {
    username: string;
    password: string;
    role: Role;
}

export interface User extends UserItem {
    id: string;
    created_at: Date;
}

export interface AccountItem {
    UserId: string;
}

export interface Account extends AccountItem {
    id: string;
    created_at: Date;
}

export interface Transaction {
    id: string;
    amount: number;
    accountId: string;
    created_at: Date;
}

export interface Order {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    totalPrice: number;
    remainingBalance: number;
    coins: number[];
    created_at: Date;
}

const calculateTotalPrice = (quantity: number, price: number) => {
    return quantity * price;
};

export class UserModel {
    // when creating a user, we have to create a user record and an account record
    static async createUser(user: UserItem): Promise<User> {
        // use transaction to ensure that both records are created or none
        const result = await database.runTransaction(
            async (client: PoolClient) => {
                const userSql = `INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *;`;
                const userResult = await client.query(userSql, [
                    user.username,
                    user.password,
                    user.role as string,
                ]);

                const accountSql = `INSERT INTO accounts (user_id) VALUES ($1) RETURNING *;`;
                await client.query(accountSql, [userResult.rows[0].id]);

                return userResult.rows[0];
            },
        );

        // check if the result failed due to duplicate key value violates unique constraint \"users_username_key\
        return result as User;
    }

    static async getUserByUsername(username: string): Promise<User | null> {
        const sql = `SELECT * FROM users WHERE username = $1;`;
        const result = await database.runQuery(sql, [username]);
        return result.rows[0];
    }

    static async getUserById(id: string): Promise<User | null> {
        const sql = `SELECT * FROM users WHERE id = $1;`;
        const result = await database.runQuery(sql, [id]);
        // TODO: exclude the password from the result
        return result.rows[0] as User;
    }

    static async getUserAccount(userId: string): Promise<Account> {
        const sql = `SELECT * FROM accounts WHERE user_id = $1;`;
        const result = await database.runQuery(sql, [userId]);
        return result.rows[0] as Account;
    }

    static async depositMoney(
        userId: string,
        amount: number,
    ): Promise<Transaction> {
        const result = await database.runTransaction(
            async (client: PoolClient) => {
                // get the account record using the user id
                let sql = `SELECT * FROM accounts WHERE user_id = $1;`;
                const accountResult = await client.query(sql, [userId]);

                if (accountResult.rows.length === 0) {
                    throw new NotFoundError("Account not found");
                }

                // update the account record with the new amount
                sql = `UPDATE accounts SET balance = balance + $1 WHERE user_id = $2 RETURNING *;`;
                const updatedAccountResult = await client.query(sql, [
                    amount,
                    userId,
                ]);

                // create a transaction record
                sql = `INSERT INTO transactions (amount, account_id) VALUES ($1, $2) RETURNING *;`;
                const transactionResult = await client.query(sql, [
                    amount,
                    updatedAccountResult.rows[0].id,
                ]);

                return transactionResult.rows[0];
            },
        );

        return result as Transaction;
    }
    // very simple and unrealistic implementation of buying a product
    static async buyProduct(
        userId: string,
        productId: string,
        quantity: number,
    ): Promise<Order> {
        let moneyInAccount = 0;
        const result = await database.runTransaction(
            async (client: PoolClient) => {
                // get the account record using the user id
                let sql = `SELECT * FROM accounts WHERE user_id = $1;`;
                const accountResult = await client.query(sql, [userId]);

                if (accountResult.rows.length === 0) {
                    throw new NotFoundError("Account not found");
                }
                // check if the product exists
                sql = `SELECT * FROM products WHERE id = $1;`;
                const productResult = await client.query(sql, [productId]);

                if (productResult.rows.length === 0) {
                    throw new NotFoundError("Product not found");
                }

                // check if the product has enough quantity
                if (productResult.rows[0].quantity < quantity) {
                    throw new ConflictError("Not enough quantity");
                }

                // check if the user has enough money to buy the product with the total price
                const totalPrice = calculateTotalPrice(
                    quantity,
                    productResult.rows[0].price,
                );
                if (accountResult.rows[0].balance < totalPrice) {
                    throw new ConflictError("Not enough balance");
                }

                // update the account record with the new amount
                sql = `UPDATE accounts SET balance = balance - $1 WHERE user_id = $2 RETURNING *;`;
                const updatedAccountResult = await client.query(sql, [
                    totalPrice,
                    userId,
                ]);

                moneyInAccount = updatedAccountResult.rows[0].balance;

                // create a transaction record with a negative amount
                sql = `INSERT INTO transactions (amount, account_id) VALUES ($1, $2) RETURNING *;`;
                await client.query(sql, [
                    -totalPrice,
                    updatedAccountResult.rows[0].id,
                ]);

                // create an order record
                sql = `INSERT INTO orders (buyer_id, product_id, quantity, total_price) VALUES ($1, $2, $3, $4) RETURNING *;`;
                const orderResult = await client.query(sql, [
                    userId,
                    productId,
                    quantity,
                    totalPrice,
                ]);

                return orderResult.rows[0];
            },
        );

        return {
            ...result,
            remainingBalance: moneyInAccount,
            coins: calculateChange(moneyInAccount),
        };
    }

    static async resetAccount(userId: string): Promise<Account> {
        const sql = `UPDATE accounts SET balance = 0 WHERE user_id = $1 RETURNING *;`;
        const result = await database.runQuery(sql, [userId]);
        return result.rows[0] as Account;
    }
}

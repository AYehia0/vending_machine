import { PoolClient } from "pg";
import database from "..";

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
    id: number;
    created_at: Date;
}

export interface AccountItem {
    UserId: string;
}

export interface Account extends AccountItem {
    id: number;
    created_at: Date;
}

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
        return result;
    }

    static async getUserByUsername(username: string): Promise<User | null> {
        const sql = `SELECT * FROM users WHERE username = $1;`;
        const result = await database.runQuery(sql, [username]);
        return result.rows[0];
    }
}

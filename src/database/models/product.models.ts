import database from "..";

export interface ProductItem {
    name?: string;
    price?: number;
    quantity?: number;
}

export interface Product extends ProductItem {
    id: string;
    created_at: Date;
}

export class ProductModel {
    static async createProduct(
        sellerId: string,
        name: string,
        price: number,
        quantity: number,
    ): Promise<Product> {
        const sql = `INSERT INTO products (name, price, quantity, seller_id) VALUES ($1, $2, $3, $4) RETURNING *;`;
        const resutl = await database.runQuery(sql, [
            name,
            price,
            quantity,
            sellerId,
        ]);
        return resutl.rows[0] as Product;
    }

    static async getProductById(id: string): Promise<Product> {
        const sql = `SELECT * FROM products WHERE id = $1;`;
        const result = await database.runQuery(sql, [id]);
        return result.rows[0] as Product;
    }

    static async getProducts(): Promise<Product[]> {
        // TODO: add pagination
        const sql = `SELECT * FROM products;`;
        const result = await database.runQuery(sql);
        return result.rows as Product[];
    }

    static async updateProduct(
        id: string,
        product: ProductItem,
    ): Promise<Product> {
        // the product given can have only the name, price, and quantity or all of them
        const sql = `UPDATE products SET 
                    name = COALESCE($1, name), 
                    price = COALESCE($2, price), 
                    quantity = COALESCE($3, quantity) 
                    WHERE id = $4 RETURNING *;`;
        const result = await database.runQuery(sql, [
            product.name,
            product.price,
            product.quantity,
            id,
        ]);
        return result.rows[0] as Product;
    }

    static async deleteProduct(id: string): Promise<boolean> {
        const sql = `DELETE FROM products WHERE id = $1;`;
        const result = await database.runQuery(sql, [id]);
        if (result.rowCount === 0) {
            return false;
        }
        return true;
    }
}

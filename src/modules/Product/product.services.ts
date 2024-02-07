// the main business logic of the product module

import {
    Product,
    ProductItem,
    ProductModel,
} from "../../database/models/product.models";
import { UserModel } from "../../database/models/user.models";

// 1. The user with role (seller) can create a product with a name, price, and quantity
export const createProduct = async (
    sellerId: string,
    name: string,
    price: number,
    quantity: number,
): Promise<Product> => {
    const product = await ProductModel.createProduct(
        sellerId,
        name,
        price,
        quantity,
    );
    return product;
};

// 2. The user with role (seller) can update a product's name, price, and quantity
export const updateProduct = async (
    id: string,
    product: ProductItem,
): Promise<Product> => {
    const updatedProduct = await ProductModel.updateProduct(id, product);
    return updatedProduct;
};

// 3. The user with role (seller) can delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
    const result = await ProductModel.deleteProduct(id);
    return result;
};

// 4. Users can view all the products
export const getProducts = async (): Promise<Product[]> => {
    const products = await ProductModel.getProducts();
    return products;
};

// 5. Users can view a product by id
export const getProductById = async (id: string): Promise<Product> => {
    const product = await ProductModel.getProductById(id);
    return product;
};

// 6. The user with role (buyer) can buy a product with the money in their account (account record)
export const buyProduct = async (
    id: string,
    userId: string,
    quantity: number,
) => {
    // it's funny that the buyProduct function is in the user module lol
    const order = await UserModel.buyProduct(userId, id, quantity);
    return order;
};

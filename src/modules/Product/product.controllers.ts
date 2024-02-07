import { Request, Response } from "express";
import {
    ConflictError,
    NotFoundError,
    handleControllerError,
} from "../../utils/errors";
import {
    buyProductSchema,
    createProductSchema,
    updateProductSchema,
} from "./product.validations";
import * as ProductService from "./product.services";

// create a product
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, price, quantity } = createProductSchema.parse(req.body);
        const product = await ProductService.createProduct(
            req.user.id,
            name,
            price,
            quantity,
        );
        return res.status(201).json(product);
    } catch (err) {
        handleControllerError(res, err);
    }
};

// get product by id
export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await ProductService.getProductById(id);
        if (!product) {
            throw new NotFoundError("Product not found");
        }
        return res.status(200).json(product);
    } catch (err) {
        handleControllerError(res, err);
    }
};

// get all products
export const getProducts = async (_: Request, res: Response) => {
    try {
        const products = await ProductService.getProducts();
        return res.status(200).json(products);
    } catch (err) {
        handleControllerError(res, err);
    }
};

// update a product
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, price, quantity } = updateProductSchema.parse(req.body);
        const product = await ProductService.updateProduct(id, {
            name,
            price,
            quantity,
        });
        return res.status(200).json(product);
    } catch (err) {
        handleControllerError(res, err);
    }
};

// delete a product
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await ProductService.deleteProduct(id);
        if (!result) {
            throw new ConflictError(
                "Could not delete product. Product not found or already deleted",
            );
        }
        return res.status(200).json({
            message: "Product deleted successfully",
        });
    } catch (err) {
        handleControllerError(res, err);
    }
};

// buy a product
export const buyProduct = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const { id, quantity } = buyProductSchema.parse(req.body);
        const order = await ProductService.buyProduct(id, userId, quantity);
        return res.status(200).json(order);
    } catch (err) {
        handleControllerError(res, err);
    }
};

import { Request, Response } from "express";
import * as UserServices from "./user.services";
import {
    registerUserSchema,
    loginUserSchema,
    depositMoneySchema,
} from "./user.validations";
import { handleControllerError } from "../../utils/errors";

// register borrower/user
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, password, role } = registerUserSchema.parse(req.body);
        const user = await UserServices.registerUser(username, password, role);
        return res.status(201).json(user);
    } catch (err) {
        handleControllerError(res, err);
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = loginUserSchema.parse(req.body);
        const token = await UserServices.loginUser(username, password);
        return res.status(200).json({
            token,
        });
    } catch (err) {
        handleControllerError(res, err);
    }
};

export const depositMoney = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const { amount } = depositMoneySchema.parse(req.body);
        const transaction = await UserServices.depositMoney(userId, amount);
        return res.status(200).json(transaction);
    } catch (err) {
        handleControllerError(res, err);
    }
};

export const buyProduct = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        const order = await UserServices.buyProduct(
            userId,
            productId,
            quantity,
        );
        return res.status(200).json(order);
    } catch (err) {
        handleControllerError(res, err);
    }
};

export const getUserAccount = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const account = await UserServices.getUserAccount(userId);
        return res.status(200).json(account);
    } catch (err) {
        handleControllerError(res, err);
    }
};

export const resetDeposit = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const transaction = await UserServices.resetDeposit(userId);
        return res.status(200).json(transaction);
    } catch (err) {
        handleControllerError(res, err);
    }
};

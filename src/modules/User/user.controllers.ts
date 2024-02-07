import { Request, Response } from "express";
import * as UserServices from "./user.services";
import { registerUserSchema, loginUserSchema } from "./user.validations";
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

import { Request, Response } from "express";

// a welcome api route for testing on /
export const welcomeAPI = (_: Request, res: Response) => {
    res.status(200).json({
        message:
            "Welcome to the vending machine api: https://github.com/AYehia0/vending_machine",
    });
};

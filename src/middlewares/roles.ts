// middleware to allow only sellers to access the routes

import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/errors";

export const roleMiddleware = (role: string) => {
    return (req: Request, _: Response, next: NextFunction) => {
        try {
            if (req.user.role !== role) {
                throw new UnauthorizedError(
                    `Only ${role}s can access this route`,
                );
            }
            next();
        } catch (err) {
            next(err);
        }
    };
};

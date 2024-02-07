import { Request, Response, NextFunction } from "express";
import { BadRequestError, UnauthorizedError } from "../utils/errors";
import { verifyToken } from "../utils/token";

export const auth = (req: Request, _: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            throw new BadRequestError("Authorization header is required");

        const token = authHeader.split(" ")[1];
        if (!token) throw new UnauthorizedError("Token not found");

        // remove the bearer prefix
        const tokenParts = authHeader.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== "bearer")
            throw new UnauthorizedError("Token not found");

        const payload = verifyToken(tokenParts[1]);
        req.user = payload;

        next();
    } catch (err) {
        next(err);
    }
};

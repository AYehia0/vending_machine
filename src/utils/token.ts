// implement jwt for authorization
import jwt from "jsonwebtoken";
import { User } from "../database/models/user.models";

export const generateToken = (user: User): string => {
    return jwt.sign(user, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
    });
};

export const verifyToken = (token: string): User => {
    return jwt.verify(token, process.env.JWT_SECRET as string) as User;
};

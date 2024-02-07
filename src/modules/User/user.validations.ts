import { z } from "zod";
import { Role } from "../../database/models/user.models";

export const registerUserSchema = z.object({
    username: z.string(),
    password: z.string().min(4).max(20),
    role: z.enum([Role.BUYER, Role.SELLER]), // TODO: Get all the roles
});

export const loginUserSchema = z.object({
    username: z.string(),
    password: z.string().min(4).max(20),
});

export const depositMoneySchema = z.object({
    // the amount should be a positive number in (5, 10, 20, 50, 100)
    amount: z.number().refine((val) => [5, 10, 20, 50, 100].includes(val)),
});

export const buyProductSchema = z.object({
    productId: z.string(),
    quantity: z.number().int().min(1),
});

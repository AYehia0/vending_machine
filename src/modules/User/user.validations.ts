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

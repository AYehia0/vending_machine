import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string(),
    price: z.number().min(1),
    quantity: z.number().int().min(1),
});

// TODO: refactor
export const updateProductSchema = z.object({
    name: z.string().optional(),
    price: z.number().min(1).optional(),
    quantity: z.number().int().min(1).optional(),
});

export const buyProductSchema = z.object({
    id: z.string(),
    quantity: z.number().int().min(1),
});

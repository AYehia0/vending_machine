import { Router } from "express";
import * as ProductControllers from "./product.controllers";
import { roleMiddleware } from "../../middlewares/roles";
import { auth } from "../../middlewares/auth";
import { catchAuthErrors } from "../../middlewares/errors.auth";

const router = Router();

// create a product
router.post(
    "/",
    auth,
    roleMiddleware("seller"),
    catchAuthErrors,
    ProductControllers.createProduct,
);
router.delete(
    "/:id",
    auth,
    roleMiddleware("seller"),
    catchAuthErrors,
    ProductControllers.deleteProduct,
);
router.get("/", ProductControllers.getProducts);
router.get("/:id", ProductControllers.getProductById);
router.patch(
    "/:id",
    auth,
    roleMiddleware("seller"),
    catchAuthErrors,
    ProductControllers.updateProduct,
);

// TODO: for now anyone can buy a product
router.post(
    "/buy",
    auth,
    roleMiddleware("buyer"),
    catchAuthErrors,
    ProductControllers.buyProduct,
);

export default router;

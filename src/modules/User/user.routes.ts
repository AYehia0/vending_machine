import { Router } from "express";
import * as UserControllers from "./user.controllers";

const router = Router();

router.post("/register", UserControllers.registerUser);
router.post("/login", UserControllers.loginUser);

export default router;

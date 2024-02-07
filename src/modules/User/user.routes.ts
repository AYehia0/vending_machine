import { Router } from "express";
import * as UserControllers from "./user.controllers";
import { auth } from "../../middlewares/auth";
import { catchAuthErrors } from "../../middlewares/errors.auth";

const router = Router();

router.post("/register", UserControllers.registerUser);
router.post("/login", UserControllers.loginUser);
router.post("/deposit", auth, catchAuthErrors, UserControllers.depositMoney);
router.get("/account", auth, catchAuthErrors, UserControllers.getUserAccount);
router.get("/reset", auth, catchAuthErrors, UserControllers.resetDeposit);

export default router;

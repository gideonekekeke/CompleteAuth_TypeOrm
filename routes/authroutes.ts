import { Router } from "express";
import {
	loginUserHandler,
	registerUserHandler,
} from "../controllers/auth.controller";
import { Validate } from "../utils/Validate";
import { LoginUserSchema, RegisterUserSchema } from "../utils/zodSchema";

const router = Router();

router.post("/register", Validate(RegisterUserSchema), registerUserHandler);
router.post("/login", Validate(LoginUserSchema), loginUserHandler);

export default router;

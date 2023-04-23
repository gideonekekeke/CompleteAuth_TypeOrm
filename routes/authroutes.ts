import { Router } from "express";
import {
	
    deserializeUser,
	loginUserHandler,
	logoutHandler,
	refreshAccessTokenHandler,
	registerUserHandler,
    requireUser,
} from "../controllers/auth.controller";
import { Validate } from "../utils/Validate";
import { LoginUserSchema, RegisterUserSchema } from "../utils/zodSchema";

const router = Router();

// register user
router.post("/register", Validate(RegisterUserSchema), registerUserHandler);

//login user
router.post("/login", Validate(LoginUserSchema), loginUserHandler);


// Logout user
router.get('/logout', deserializeUser, requireUser, logoutHandler);


// Refresh access token
router.get('/refresh', refreshAccessTokenHandler);

export default router;

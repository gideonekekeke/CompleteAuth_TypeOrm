import { Router } from "express";
import {
	deserializeUser,
	getMeHandler,
	requireUser,
} from "../controllers/auth.controller";

const router = Router();

router.use(deserializeUser, requireUser);

// Get currently logged in user
router.get("/me", getMeHandler);

export default router;

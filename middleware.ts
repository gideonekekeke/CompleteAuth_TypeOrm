import { Application, NextFunction, Request, Response } from "express";
import AppError from "./utils/appError";
import auth from "./routes/authroutes";
import user from "./routes/user.routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";

export const middleware = (app: Application) => {
	// ROUTES
	app
		.use(cors())
		.use(express.json())
		.use("/api/auth", auth)
		.use("/api/users", user);

	// 2. Logger
	if (process.env.NODE_ENV === "development")
		app
			.use(morgan("dev"))

			// 3. Cookie Parser
			.use(cookieParser())

			// UNHANDLED ROUTE

			.all("*", (req: Request, res: Response, next: NextFunction) => {
				next(new AppError(404, `Route ${req.originalUrl} not found`));
			})

			.use(
				(error: AppError, req: Request, res: Response, next: NextFunction) => {
					error.status = error.status || "error";
					error.statusCode = error.statusCode || 500;

					res.status(error.statusCode).json({
						status: error.status,
						message: error.message,
					});
				},
			);
};

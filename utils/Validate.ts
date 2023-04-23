import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const Validate =
	(schema: AnyZodObject) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				params: req.params,
				query: req.query,
				body: req.body,
			});

			next();
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					status: "fail",
					errors: error.errors[0].message,
				});
			}

			next(error);
		}
	};

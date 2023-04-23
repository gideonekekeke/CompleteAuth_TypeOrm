import { NextFunction, Request, Response } from "express";
import { User } from "../models/UserEntity";
import AppError from "../utils/appError";
import {
	accessTokenCookieOptions,
	refreshTokenCookieOptions,
} from "../utils/CookiesOptions";
import { SignTokens } from "../utils/Token";

function generateRandomId() {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const length = 12;
	let randomId = "";
	for (let i = 0; i < length; i++) {
		randomId += characters.charAt(
			Math.floor(Math.random() * characters.length),
		);
	}
	return randomId;
}



export const registerUserHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { name, password, email } = req.body;

		const user = await User.create({
			name,
			email: email,
			password,
		}).save();
		return res.status(201).json({
			message: "successfull",
			data: user,
		});
	} catch (error) {
		if (error.code === "23505") {
			return res.status(409).json({
				status: "fail",
				message: "User with that email already exist",
			});
		}
		next(error);
	}
};

export const loginUserHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { password, email } = req.body;

		const user = await User.findOneBy({ email });
		if (!user || !(await User.comparePasswords(password, user.password))) {
			return res.json(new AppError(400, "Invalid email or password"));
		}

		const updateSession = await User.update(user.id, {
			sessionID: generateRandomId(),
		});

		//sign access and refresh token
		//we would store them in the cookies

		const { access_token, refresh_token } = await SignTokens(user);

		res.cookie("access_token", access_token, accessTokenCookieOptions);
		res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
		res.cookie("logged_in", true, {
			...accessTokenCookieOptions,
			httpOnly: false,
		});

		res.status(200).json({
			status: "success",
			access_token,
			updateSession,
		});
	} catch (error) {
		next(error);
	}
};

export const getMeHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = res.locals.user;

		res.status(200).status(200).json({
			status: "success",
			data: {
				user,
			},
		});
	} catch (err: any) {
		next(err);
	}
};

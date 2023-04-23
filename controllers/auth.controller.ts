import { NextFunction, Request, Response } from "express";
import { User } from "../models/UserEntity";
import AppError from "../utils/appError";
import {
	accessTokenCookieOptions,
	refreshTokenCookieOptions,
} from "../utils/CookiesOptions";
import { signJwt, verifyJwt } from "../utils/jwt";
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
			email: email.toLowerCase(),
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

		// creating a session id for the user
		await User.update(user.id, {
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
		});
	} catch (error) {
		next(error);
	}
};

//refresh token
// ? Cookie Options Here

// ? Register User Controller

// ? Login User Controller

export const refreshAccessTokenHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const refresh_token = req.cookies.refresh_token;
		const { sessionID } = req.body;

		const message = "Could not refresh access token";

		if (!refresh_token) {
			return next(new AppError(403, message));
		}

		// Validate refresh token
		const decoded = verifyJwt<{ sub: string }>(
			refresh_token,
			process.env.REFRESH_TOKEN_PRIVATE_KEY,
		);

		if (!decoded) {
			return next(new AppError(403, message));
		}

		// Check if user has a valid session
		const user = await User.findOneBy(sessionID);
		console.log(user);

		if (!user.sessionID) {
			return next(new AppError(403, message));
		}

		// Sign new access token
		const access_token = signJwt(
			{ sub: user.id },
			process.env.ACCESS_TOKEN_PRIVATE_KEY,
			{
				expiresIn: `10m`,
			},
		);

		// 4. Add Cookies
		res.cookie("access_token", access_token, accessTokenCookieOptions);
		res.cookie("logged_in", true, {
			...accessTokenCookieOptions,
			httpOnly: false,
		});

		// 5. Send response
		res.status(200).json({
			status: "success",
			access_token,
		});
	} catch (err: any) {
		next(err);
	}
};

//logout user
const logout = (res: Response) => {
	res.cookie("access_token", "", { maxAge: -1 });
	res.cookie("refresh_token", "", { maxAge: -1 });
	res.cookie("logged_in", "", { maxAge: -1 });
};

export const logoutHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { sessionID } = req.body;

		const user = await User.findOneBy(sessionID);
		await User.update(user.id, {
			sessionID: null,
		});
		logout(res);

		res.status(200).json({
			status: "success",
		});
	} catch (err: any) {
		next(err);
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

//store the login user to the req.cookies
export const deserializeUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		let access_token: any;
		const { sessionID } = req.body;

		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			access_token = req.headers.authorization.split(" ")[1];
		} else if (req.cookies.access_token) {
			access_token = req.cookies.access_token;
		}

		console.log(req.cookies);

		if (!access_token) {
			return next(new AppError(401, "You are not logged in"));
		}

		// Validate the access token
		const decoded = verifyJwt(
			access_token,
			process.env.ACCESS_TOKEN_PRIVATE_KEY,
		);

		if (!decoded) {
			return next(
				new AppError(401, `Invalid token or user doesn't existsssss`),
			);
		}

		// Check if the user has a valid session
		const session = await User.findOneBy(sessionID);
		// console.log("this is session", session);

		if (!session) {
			return next(new AppError(401, `Invalid token or session has expired`));
		}

		// Add user to res.locals
		res.locals.user = session;

		next();
	} catch (err: any) {
		next(err);
	}
};

// checking if they is a user
export const requireUser = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = res.locals.user;

		if (!user) {
			return next(
				new AppError(400, `Session has expired or user doesn't exist`),
			);
		}

		next();
	} catch (err: any) {
		next(err);
	}
};

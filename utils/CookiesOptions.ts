import { CookieOptions } from "express";

const cookiesOption: CookieOptions = {
	httpOnly: true,
	sameSite: "lax",
};
// 
if (process.env.NODE_ENV === "production") cookiesOption.secure = true;

export const accessTokenCookieOptions = {
	...cookiesOption,
	expires: new Date(Date.now() + 50 * 60 * 1000),
	maxAge: 50 * 60 * 1000,
};

export const refreshTokenCookieOptions = {
	...cookiesOption,
	expires: new Date(Date.now() + 50 * 60 * 1000),
	maxAge: 50 * 60 * 1000,
};

import config from "config";
import { User } from "../models/UserEntity";
import { signJwt } from "./jwt";

export const SignTokens = async (user: User) => {
	const access_token = signJwt(
		{
			sub: user.id,
		},
		process.env.ACCESS_TOKEN_PRIVATE_KEY,
		{
			expiresIn: `10m`,
		},
	);

	const refresh_token = signJwt(
		{ sub: user.id },
		process.env.REFRESH_TOKEN_PRIVATE_KEY,
		{
			expiresIn: `1y`,
		},
	);

	return { access_token, refresh_token };
};

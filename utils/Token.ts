import config from "config";
import { User } from "../models/UserEntity";
import { signJwt } from "./jwt";

export const SignTokens = async (user: User) => {
	const access_token = signJwt(
		{
			sub: user.id,
		},
		"ACCESS_TOKEN_PRIVATE_KEY",
		{
			expiresIn: `30m`,
		},
	);

	const refresh_token = signJwt({ sub: user.id }, "REFRESH_TOKEN_PRIVATE_KEY", {
		expiresIn: `10m`,
	});

	return { access_token, refresh_token };
};

import { SignOptions, sign, verify, decode } from "jsonwebtoken";
import config from "config";

export const signJwt = (
	payload: Object,
	keyName: "ACCESS_TOKEN_PRIVATE_KEY" | "REFRESH_TOKEN_PRIVATE_KEY",
	options: SignOptions,
) => {
	const privateKey = Buffer.from(
		process.env[keyName], // access the environment variable here
		"base64",
	).toString("ascii");
	return sign(payload, privateKey, {
		...(options && options),
		algorithm: "RS256",
	});
};

export const verifyJwt = <T>(
	token: string,
	keyName: "accessTokenPublicKey" | "refreshTokenPublicKey",
): T | null => {
	try {
		const publicKey = Buffer.from(
			config.get<string>(keyName),
			"base64",
		).toString("ascii");
		const decoded = verify(token, publicKey) as T;

		return decoded;
	} catch (error) {
		return null;
	}
};

import { SignOptions, sign, verify, decode } from "jsonwebtoken";
import config from "config";

export const signJwt = (
	payload: Object,
	keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
	options: SignOptions,
) => {
	// jwt.sign() methods only takes ascii as the private key thats what this line of code is doing
	const privateKey = Buffer.from(
		config.get<string>(keyName),
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

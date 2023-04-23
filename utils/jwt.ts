import { SignOptions, sign, verify } from "jsonwebtoken";


export const signJwt = (
	payload: Object,
	keyName: string,
	options: SignOptions,
) => {
	return sign(payload, keyName, {
		...(options && options),
	});
};

export const verifyJwt = <T>(token: string, keyName: string): T | null => {
	try {
		// const publicKey = Buffer.from(
		// config.get<string>(keyName),
		// "base64",
		// ).toString("ascii");
		const decoded = verify(token, keyName) as T;

		return decoded;
	} catch (error) {
		return null;
	}
};

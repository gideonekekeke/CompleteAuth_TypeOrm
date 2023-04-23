import { object, string, TypeOf, optional, nativeEnum } from "zod";
import { RoleEnumType } from "../models/UserEntity";

export const RegisterUserSchema = object({
	body: object({
		name: string({
			required_error: "Name is required",
		}),

		email: string({
			required_error: "email is required",
		}).email("Invalid email address"),

		password: string({
			required_error: "password is required",
		}).min(8, "Password must be more that 8 characters"),

		passwordConfirm: string({
			required_error: "Confirm password is required",
		}),
		role: optional(nativeEnum(RoleEnumType)),
	}).refine((data) => data.password === data.passwordConfirm, {
		path: ["passwordConfirm"],
		message: "Password",
	}),
});

export const LoginUserSchema = object({
	body: object({
		email: string({
			required_error: "Email is required",
		}).email("invalid email address"),
		password: string({
			required_error: "Password is required",
		}).min(8, "Password must be more that 8 characters"),
	}),
});

export type RegisterUserInput = Omit<
	TypeOf<typeof RegisterUserSchema>["body"],
	"passwordConfirm"
>;

export type LoginUserInput = TypeOf<typeof LoginUserSchema>["body"];

import { Column, Entity, Index } from "typeorm";
import Model from "./model.entity";

export enum RoleEnumType {
	USER = "user",
	ADMIN = "admin",
}

@Entity("users")
export class User extends Model {
	@Column()
	name: string;

	@Index("email_index")
	@Column({
		unique: true,
	})
	email: string;

	@Column()
	password: string;

	@Column({
		type: "enum",
		enum: RoleEnumType,
		default: RoleEnumType.USER,
	})
	role: RoleEnumType.USER;

	@Column({
		default:
			"https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg",
	})
	avatar: string;

	@Column({
		default: false,
	})
	verified: boolean;

	// toJson(){
	// // return {...this, password : undefined, verified : undefined}
	// }
}

import {
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
	BaseEntity,
} from "typeorm";

export default abstract class Model extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@CreateDateColumn()
	created_At: Date;

	@UpdateDateColumn()
	updated_At: Date;
}

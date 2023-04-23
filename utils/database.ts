import { DataSource } from "typeorm";
import dotenv from "dotenv";


dotenv.config();

export const dbConfig = new DataSource({
	type: "postgres",
	host: "localhost",
	port: parseInt(process.env.POSTGRES_PORT!),
	username: process.env.POSTGRES_USERNAME,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DATABASE,
	synchronize: true,
	logging: false,
	entities: [],
});

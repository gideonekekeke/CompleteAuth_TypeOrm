import express from "express";
const port = 6000;
import { dbConfig } from "./utils/database";

const app = express();

dbConfig
	.initialize()
	.then(() => {
		console.log("posgres database is connected");
	})
	.catch(() => {
		console.log("an error occured with the database");
	});

const server = app.listen(port, () => {
	console.log("listening on port");
});

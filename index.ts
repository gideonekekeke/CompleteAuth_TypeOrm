import express from "express";
import { middleware } from "./middleware";
const port = 6637;
import { dbConfig } from "./utils/database";

const app = express();
middleware(app);

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

process.on("uncaughtException", () => {
	console.log("server uncaught exception");
	process.exit(1);
});

process.on("unhandledRejection", (res: any) => {
	console.log(res);
	server.close(() => {
		process.exit(1);
	});
});

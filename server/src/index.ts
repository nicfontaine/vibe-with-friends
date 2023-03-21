import * as dotenv from "dotenv";
import app from "./expr";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import mongoose from "mongoose";
import http from "http";
import { readFileSync } from "fs";
import resolvers from "./graphql/resolvers";
const typeDefs = readFileSync("./src/graphql/schema.graphql", { encoding: "utf-8" });
import { cleanEnv, url } from "envalid";
const env = cleanEnv(process.env, {
	MONGO_URL: url(),
});

dotenv.config();
const PORT = process.env.PORT || 3680;

const startServer = async function () {
	await mongoose.connect(env.MONGO_URL);
	const httpServer = http.createServer(app);
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	});
	await server.start();
	app.use(expressMiddleware(server));
	httpServer.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`); 
	});
};

startServer();

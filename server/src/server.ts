import * as dotenv from "dotenv";
import app from "./app";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import mongoose from "mongoose";
import http from "http";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";

dotenv.config();
const PORT = process.env.PORT || 3680;

const startServer = async function () {
	//
	await mongoose.connect(process.env.MONGO_URL as string);

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
	//
};

startServer();

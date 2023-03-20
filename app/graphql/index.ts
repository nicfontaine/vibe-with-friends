import Pusher from "pusher";
import { readFileSync } from "fs";
import resolvers from "./resolvers";
const typeDefs = readFileSync("./src/graphql/schema.graphql", { encoding: "utf-8" });

const pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID as string,
	key: process.env.PUSHER_KEY as string,
	secret: process.env.PUSHER_SECRET as string,
	cluster: process.env.PUSHER_CLUSTER as string,
	useTLS: true,
});

export { pusher };
import express, { Express } from "express";
import cors from "cors";
import Pusher from "pusher";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { cleanEnv, str } from "envalid";

dotenv.config();

const env = cleanEnv(process.env, {
	PUSHER_APP_ID: str(),
	PUSHER_CLUSTER: str(),
	PUSHER_KEY: str(),
	PUSHER_SECRET: str(),
})
const pusher = new Pusher({
	appId: env.PUSHER_APP_ID,
	key: env.PUSHER_KEY,
	secret: env.PUSHER_SECRET,
	cluster: env.PUSHER_CLUSTER,
	useTLS: true,
});

const app = express();
app.use(express.json(), cors(), bodyParser.json());

// app.get("*", (req: Request, res: Response) => {
// 	res.send("Backend");
// });

export default app;
export { pusher };

import express, { Express } from "express";
import cors from "cors";
import Pusher from "pusher";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
dotenv.config();
const pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID as string,
	key: process.env.PUSHER_KEY as string,
	secret: process.env.PUSHER_SECRET as string,
	cluster: process.env.PUSHER_CLUSTER as string,
	useTLS: true,
});

const app: Express = express();
app.use(express.json(), cors(), bodyParser.json());

// app.get("*", (req: Request, res: Response) => {
// 	res.send("Backend");
// });

export default app;
export { pusher };

import express, { Express } from "express";
import cors from "cors";
import Pusher from "pusher";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import groupCreate from "./routes/group-create";
import groupJoin from "./routes/group-join";
import changeUserName from "./routes/change-username";
import playTapOn from "./routes/play-tap-on";
import playTapOff from "./routes/play-tap-off";
import playSync from "./routes/play-sync";
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

app.post("/api/group/create", groupCreate);
app.post("/api/group/join", groupJoin);
app.post("/api/group/change-username", changeUserName);
app.post("/api/group/play-tap-on", playTapOn);
app.post("/api/group/play-tap-off", playTapOff);
app.post("/api/group/play-sync", playSync);

// app.get("*", (req: Request, res: Response) => {
// 	res.send("Backend");
// });

export default app;
export { pusher };

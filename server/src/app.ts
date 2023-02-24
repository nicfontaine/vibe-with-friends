import express, { Express, Request, Response } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import createGroupID from "./util/create-group-id";
import Pusher from "pusher";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { IUser, IGroup, IGroupUser, IStore, ISheet } from "./types";
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

// TODO: Replace with DB
const store: IStore = {};

// Create new group, as owner
app.post("/api/group/create", (req: Request, res: Response) => {
	//
	const { user }: { user: IUser } = req.body;
	user.id = user.id || uuidv4();

	const group: IGroup = {
		id: createGroupID(),
		ownerID: user.id,
		lastEvent: Date.now(),
		users: {
			[user.id]: { name: user.name, isOwner: true },
		},
	};

	store[group.id] = group;

	console.log(`[/api/group/create] New group created: ${group.id}`);
	res.status(200).json({ user, group });
	//
});

app.post("/api/group/join", (req: Request, res: Response) => {
	//
	const { user, group }: { user: IUser; group: IGroup } = req.body;
	user.id = user.id || uuidv4();

	// Group doesn't exist / expired
	if (!(group.id in store)) {
		console.log(`[/api/group/join] Group not found: ${group.id}`);
		user.isOwner = false;
		group.id = "";
		return res.status(200).json({ err: "Group not found", user, group });
	}

	group.ownerID = store[group.id].ownerID;
	store[group.id].lastEvent = Date.now();

	// User is owner. Already set to ownerID, and in list of users
	if (user.id === store[group.id].ownerID) {
		user.isOwner = true;
		console.log(
			`[/api/group/join] User is group owner, rejoining: ${group.id}`,
		);
	}
	// New group user
	else if (!(user.id in store[group.id].users)) {
		store[group.id].users[user.id] = {
			name: user.name,
			isOwner: false,
		};
		console.log("trigger add user");
		pusher.trigger(group.id, "add-user", {
			message: store[group.id],
		});
		console.log(`[/api/group/join] User added to group: ${group.id}`);
	}
	// User exists in group
	else {
		console.log(`[/api/group.id/join] User already in group: ${group.id}`);
		store[group.id].users[user.id].isOwner = false;
	}

	group.users = store[group.id].users;
	res.status(200).json({ user, group });
	//
});

app.post("/api/group/change-username", (req: Request, res: Response) => {
	const { user, group }: { user: IUser; group: IGroup } = req.body;
	if (!store[group.id]) {
		console.log(`[/api/group/change-username] Group not found: ${group.id}`);
		return res.status(200).json({ err: "Group not found" });
	}
	store[group.id].users[user.id].name = user.name;
	store[group.id].lastEvent = Date.now();
	group.users = store[group.id].users;
	console.log(`[/api/group/change-username] Changed to ${user.name}`);
	pusher.trigger(group.id, "change-username", {
		message: store[group.id],
	});
	res.status(200).json({ user, group });
});

app.post("/api/group/play-tap-on", (req: Request, res: Response) => {
	const { user, group }: { user: IUser; group: IGroup } = req.body;
	if (!store[group.id]) {
		console.log(`[/api/group/play-tap-on] Group not found: ${group.id}`);
		return res.status(200).json({ err: "Group not found" });
	}
	store[group.id].lastEvent = Date.now();
	pusher.trigger(group.id, "play-tap-on", {
		message: user,
	});
	res.status(200).json({});
});

app.post("/api/group/play-tap-off", (req: Request, res: Response) => {
	const { user, group }: { user: IUser; group: IGroup } = req.body;
	if (!store[group.id]) {
		console.log(`[/api/group/play-tap-off] Group not found: ${group.id}`);
		return res.status(200).json({ err: "Group not found" });
	}
	store[group.id].lastEvent = Date.now();
	pusher.trigger(group.id, "play-tap-off", {
		message: user,
	});
	res.status(200).json({});
});

app.post("/api/group/play-sync", (req: Request, res: Response) => {
	const { gid, sheet }: { gid: string; sheet: ISheet } = req.body;
	if (!store[gid]) {
		console.log(`[/api/group/play-tap-on] Group not found: ${gid}`);
		return res.status(200).json({ err: "Group not found" });
	}
	store[gid].lastEvent = Date.now();
	const now = new Date().toISOString();
	const start = new Date(Date.now() + 3 * 1000).toISOString();

	pusher.trigger(gid, "play-sync", {
		message: { start, sheet },
	});
	res.status(200).json({});
});

// app.get("*", (req: Request, res: Response) => {
// 	res.send("Backend");
// });

export default app;

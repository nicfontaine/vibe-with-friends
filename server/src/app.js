import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import createGroupID from "./util/create-group-id";
import Pusher from "pusher";
import * as dotenv from "dotenv";
dotenv.config();
const pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID,
	key: process.env.PUSHER_KEY,
	secret: process.env.PUSHER_SECRET,
	cluster: process.env.PUSHER_CLUSTER,
	useTLS: true,
});

const app = express();
app.use(express.json());
app.use(cors());

// TODO: Replace with DB
const store = {};

// Create new group, as owner
app.post("/api/group/create", (req, res) => {
	//
	const { user } = req.body;
	user.id = user.id || uuidv4();

	const group = {
		id: createGroupID(),
		ownerID: user.id,
	};

	store[group.id] = {
		ownerID: user.id,
		users: {
			[user.id]: { name: user.name, isOwner: true },
		},
	};

	group.users = store[group.id].users;

	console.log(`[/api/group/create] New group created: ${group.id}`);
	res.status(200).json({ user, group });
	//
});

app.post("/api/group/join", (req, res) => {
	//
	const { user, group } = req.body;
	user.id = user.id || uuidv4();

	// Group doesn't exist / expired
	if (!(group.id in store)) {
		console.log(`[/api/group/join] Group not found: ${group.id}`);
		user.isOwner = false;
		group.id = null;
		return res.status(200).json({
			err: "Group not found",
			user,
			group,
		});
	}

	group.ownerID = store[group.id].ownerID;

	// User is owner. Already set to ownerID, and in list of users
	if (user.id === store[group.id].ownerID) {
		user.isOwner = true;
		console.log(
			`[/api/group/join] User is group owner, rejoining: ${group.id}`,
		);
	}
	// New group user
	else if (!([user.id] in store[group.id].users)) {
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
	}

	group.users = store[group.id].users;
	res.status(200).json({ user, group });
	//
});

app.post("/api/group/play-tap-on", (req, res) => {
	const { user, group } = req.body;
	pusher.trigger(group.id, "play-tap-on", {
		message: user,
	});
	res.status(200).send();
});

app.post("/api/group/play-tap-off", (req, res) => {
	const { user, group } = req.body;
	pusher.trigger(group.id, "play-tap-off", {
		message: user,
	});
	res.status(200).send();
});

app.post("/api/group/change-username", (req, res) => {
	const { user, group } = req.body;
	store[group.id].users[user.id].name = user.name;
	group.users = store[group.id].users;
	pusher.trigger(group.id, "change-username", {
		message: store[group.id],
	});
	res.status(200).json({ user, group });
});

app.post("/api/group/play-sync", (req, res) => {
	const { gid, sheet } = req.body;
	pusher.trigger(gid, "play-sync", {
		message: sheet,
	});
	res.status(200).send();
});

// app.get("*", (req, res) => {
// 	res.send("Backend");
// });

export default app;

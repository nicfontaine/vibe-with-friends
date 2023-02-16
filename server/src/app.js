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

app.post("/api/group/create", (req, res) => {
	const groupID = createGroupID();
	const userID = req.body.userID || uuidv4();
	store[groupID] = {
		ownerID: userID,
		users: {
			[userID]: { name: "" },
		},
	};
	console.log(`[/api/group/create] New group created: ${groupID}`);
	res.status(200).json({
		groupID,
		userID,
		users: store[groupID].users,
	});
});

app.post("/api/group/join", (req, res) => {
	//
	const { groupID } = req.body;
	const userID = req.body.userID || uuidv4();
	const rtn = { groupID, userID, isOwner: false };

	// Group doesn't exist / expired
	if (!(groupID in store)) {
		console.log(`[/api/group/join] Group not found: ${groupID}`);
		return res.status(200).json({
			err: "Group not found",
			groupID: null,
			userID,
			isOwner: false,
		});
	}

	rtn.ownerID = store[groupID].ownerID;

	// User is owner. Already set to ownerID, and in list of users
	if (userID === store[groupID].ownerID) {
		rtn.isOwner = true;
		console.log(`[/api/group/join] User is group owner, rejoining: ${groupID}`);
	}
	// New group user
	else if (!([userID] in store[groupID].users)) {
		store[groupID].users[userID] = { name: "" };
		console.log(`[/api/group/join] User added to group: ${groupID}`);
	}
	// User exists in group
	else {
		console.log(`[/api/groupID/join] User already in group: ${groupID}`);
	}

	pusher.trigger(groupID, "add-user", {
		message: "User Added",
		store: store[groupID],
	});

	rtn.users = store[groupID].users;
	res.status(200).json(rtn);
});

// app.get("*", (req, res) => {
// 	res.send("Backend");
// });

export default app;

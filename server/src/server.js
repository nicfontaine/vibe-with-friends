import express from "express";
import namor from "namor";
import { v4 as uuidv4 } from "uuid";
const PORT = process.env.PORT || 3680;

const app = express();
app.use(express.json());

// Convert "one-two-three" to "oneTwoThree"
const createGroupID = function () {
	const _gid = namor.generate({ words: 3, saltLength: 0 }).split("-");
	const group =
		_gid.shift() + _gid.map((g) => g[0].toUpperCase() + g.slice(1)).join("");
	return group;
};

// TODO: Replace with DB
const store = {};

app.post("/api/group/create", (req, res) => {
	const groupID = createGroupID();
	const userID = req.body.userID || uuidv4();
	store[groupID] = {
		owner: res,
		clients: {},
	};
	console.log(`[/api/group/create] New group created: ${groupID}`);
	res.status(200).json({
		groupID,
		userID,
		numberConnected: Object.keys(store[groupID].clients).length,
	});
});

app.post("/api/group/join", (req, res) => {
	const { groupID } = req.body;
	if (!(groupID in store)) {
		console.log(`[/api/group/join] Group not found: ${groupID}`);
		return res.status(500).json({ groupID: null });
	}
	const userID = req.body.userID || uuidv4();
	if (!([userID] in store[groupID].clients)) {
		store[groupID].clients[userID] = res;
		console.log(
			`[/api/group/join] User added to group: ${groupID} (${
				Object.keys(store[groupID].clients).length
			} clients)`,
		);
	} else {
		console.log(
			`[/api/groupID/join] User already in group: ${groupID} (${
				Object.keys(store[groupID].clients).length
			} clients)`,
		);
	}
	res.status(200).json({ groupID, userID });
});

app.get("*", (req, res) => {
	res.send("Backend");
});

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

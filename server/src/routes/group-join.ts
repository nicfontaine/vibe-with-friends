import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { User, Group, GroupUser } from "../types";
import store from "../store";
import { pusher } from "../app";

const groupJoin = function (req: Request, res: Response) {
	//
	const { user, group }: { user: User; group: Group } = req.body;
	user.uid = user.uid || uuidv4();

	// Group doesn't exist / expired
	if (!(group.name in store)) {
		console.log(`[/api/group/join] Group not found: ${group.name}`);
		user.isOwner = false;
		group.name = "";
		return res.status(200).json({ err: "Group not found", user, group });
	}

	group.ownerID = store[group.name].ownerID;
	store[group.name].lastEvent = Date.now();
	const userGroupIndex = store[group.name].users.findIndex((u) => u.uid === user.uid);

	// User is owner. Already set to ownerID, and in list of users
	if (user.uid === store[group.name].ownerID) {
		user.isOwner = true;
		console.log(
			`[/api/group/join] User is group owner, rejoining: ${group.name}`,
		);
	} else if (userGroupIndex < 0) {
		// New group user
		// TODO: GQL groupUser()
		store[group.name].users.push({
			uid: user.uid,
			name: user.name,
			isOwner: false,
		});
		console.log("trigger add user");
		pusher.trigger(group.name, "add-user", {
			message: store[group.name],
		});
		console.log(`[/api/group/join] User added to group: ${group.name}`);
	} else {
		// User exists in group
		console.log(`[/api/group/join] User already in group: ${group.name}`);
		const ulist = store[group.name].users.map((u: GroupUser) => {
			if (u.uid !== user.uid) return u;
			u.isOwner = false;
			return u;
		});
		store[group.name].users = ulist;
	}

	group.users = store[group.name].users;
	res.status(200).json({ user, group });
	//
};

export default groupJoin;
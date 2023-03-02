import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { IUser, IGroup, IGroupUser } from "../types";
import store from "../store";
import { pusher } from "../app";

const groupJoin = function (req: Request, res: Response) {
	//
	const { user, group }: { user: IUser; group: IGroup } = req.body;
	user.uid = user.uid || uuidv4();

	// Group doesn't exist / expired
	if (!(group.id in store)) {
		console.log(`[/api/group/join] Group not found: ${group.id}`);
		user.isOwner = false;
		group.id = "";
		return res.status(200).json({ err: "Group not found", user, group });
	}

	group.ownerID = store[group.id].ownerID;
	store[group.id].lastEvent = Date.now();
	const userGroupIndex = store[group.id].users.findIndex((u) => u.uid === user.uid);

	// User is owner. Already set to ownerID, and in list of users
	if (user.uid === store[group.id].ownerID) {
		user.isOwner = true;
		console.log(
			`[/api/group/join] User is group owner, rejoining: ${group.id}`,
		);
	} else if (userGroupIndex < 0) {
		// New group user
		// TODO: GQL groupUser()
		store[group.id].users.push({
			uid: user.uid,
			name: user.name,
			isOwner: false,
		});
		console.log("trigger add user");
		pusher.trigger(group.id, "add-user", {
			message: store[group.id],
		});
		console.log(`[/api/group/join] User added to group: ${group.id}`);
	} else {
		// User exists in group
		console.log(`[/api/group.id/join] User already in group: ${group.id}`);
		// TODO: GQL groupUser()
		const ulist = store[group.id].users.map((u: IGroupUser) => {
			if (u.uid !== user.uid) return u;
			u.isOwner = false;
			return u;
		});
		store[group.id].users = ulist;
		// store[group.id].users[user.uid].isOwner = false;
	}

	group.users = store[group.id].users;
	res.status(200).json({ user, group });
	//
};

export default groupJoin;
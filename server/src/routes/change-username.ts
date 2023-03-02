import { Request, Response } from "express";
import { IUser, IGroup, IGroupUser } from "../types";
import store from "../store";
import { pusher } from "../app";

const changeUserName = function (req: Request, res: Response) {
	const { user, group }: { user: IUser; group: IGroup } = req.body;
	if (!store[group.id]) {
		console.log(`[/api/group/change-username] Group not found: ${group.id}`);
		return res.status(200).json({ err: "Group not found" });
	}
	// TODO: GQL groupUser()
	const ulist = store[group.id].users.map((u: IGroupUser) => {
		if (u.uid !== user.uid) return u;
		u.name = user.name;
		return u;
	});
	store[group.id].users = ulist;
	store[group.id].lastEvent = Date.now();
	group.users = store[group.id].users;
	console.log(`[/api/group/change-username] Changed to ${user.name}`);
	pusher.trigger(group.id, "change-username", {
		message: store[group.id],
	});
	res.status(200).json({ user, group });
};

export default changeUserName;
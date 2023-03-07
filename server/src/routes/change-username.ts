import { Request, Response } from "express";
import { IUser, IGroup, IGroupUser } from "../types";
import store from "../store";
import { pusher } from "../app";

const changeUserName = function (req: Request, res: Response) {
	const { user, group }: { user: IUser; group: IGroup } = req.body;
	if (!store[group.name]) {
		console.log(`[/api/group/change-username] Group not found: ${group.name}`);
		return res.status(200).json({ group, err: "Group not found" });
	}
	// TODO: GQL groupUser()
	const ulist = store[group.name].users.map((u: IGroupUser) => {
		if (u.uid !== user.uid) return u;
		u.name = user.name;
		return u;
	});
	store[group.name].users = ulist;
	store[group.name].lastEvent = Date.now();
	group.users = store[group.name].users;
	console.log(`[/api/group/change-username] Changed to ${user.name}`);
	pusher.trigger(group.name, "change-username", {
		message: store[group.name],
	});
	res.status(200).json({ user, group });
};

export default changeUserName;
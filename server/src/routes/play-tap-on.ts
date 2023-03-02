import { Request, Response } from "express";
import { IUser, IGroup, IGroupUser } from "../types";
import store from "../store";
import { pusher } from "../app";

const playTapOn = function (req: Request, res: Response) {
	const { user, group }: { user: IUser; group: IGroup } = req.body;
	if (!store[group.id]) {
		console.log(`[/api/group/play-tap-on] Group not found: ${group.id}`);
		return res.status(200).json({ err: "Group not found" });
	}
	// TODO: GQL groupEvent()
	store[group.id].lastEvent = Date.now();
	pusher.trigger(group.id, "play-tap-on", {
		message: user,
	});
	res.status(200).json({});
};

export default playTapOn;
import { Request, Response } from "express";
import { User, Group } from "../types";
import store from "../store";
import { pusher } from "../app";

const playTapOn = function (req: Request, res: Response) {
	const { user, group }: { user: User; group: Group } = req.body;
	if (!store[group.name]) {
		console.log(`[/api/group/play-tap-on] Group not found: ${group.name}`);
		return res.status(200).json({ err: "Group not found" });
	}
	store[group.name].lastEvent = Date.now();
	pusher.trigger(group.name, "play-tap-on", {
		message: user,
	});
	res.status(200).json({});
};

export default playTapOn;
import { Request, Response } from "express";
import { ISheet } from "../types";
import store from "../store";
import { pusher } from "../app";

const playSync = function (req: Request, res: Response) {
	const { gid, sheet }: { gid: string; sheet: ISheet } = req.body;
	if (!store[gid]) {
		console.log(`[/api/group/play-tap-on] Group not found: ${gid}`);
		return res.status(200).json({ err: "Group not found" });
	}
	// TODO: GQL groupEvent()
	store[gid].lastEvent = Date.now();
	const start = new Date(Date.now() + 3 * 1000).toISOString();

	pusher.trigger(gid, "play-sync", {
		message: { start, sheet },
	});
	res.status(200).json({});
};

export default playSync;
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import createGroupID from "../util/create-group-id";
import { IUser, IGroup } from "../types";
import store from "../store";

// Create new group, as owner
const groupCreate = function (req: Request, res: Response) {
	const { user }: { user: IUser } = req.body;
	user.uid = user.uid || uuidv4();
	const group: IGroup = {
		id: createGroupID(),
		ownerID: user.uid,
		lastEvent: Date.now(),
		users: [{ uid: user.uid, name: user.name, isOwner: true }],
	};
	// TODO: GQL createGroup()
	store[group.id] = group;
	console.log(`[/api/group/create] New group created: ${group.id}`);
	res.status(200).json({ user, group });
};

export default groupCreate;
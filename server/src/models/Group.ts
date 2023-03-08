import { model, Schema } from "mongoose";
import { Group, GroupUser } from "../types";

const groupUserSchema: Schema = new Schema<GroupUser>({
	uid: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	isOwner: {
		type: Boolean,
		required: true,
	},
});

const groupSchema: Schema = new Schema<Group>({
	name: {
		type: String,
		required: true,
	},
	ownerID: {
		type: String,
		required: true,
	},
	lastEvent: {
		type: Number,
		required: true,
	},
	users: [{
		type: groupUserSchema,
	}],
});

export default model<Group>("GroupModel", groupSchema);

import { model, Schema } from "mongoose";

type GroupUser = {
	uid: string;
	name: string;
	isOwner: boolean;
};
type Group = {
	name: string;
	ownerID: string;
	lastEvent: number;
	users: GroupUser[];
};

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

export default model<Group>("Group", groupSchema);

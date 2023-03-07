import { model, Schema } from "mongoose";

type IGroupUser = {
	uid: string;
	name: string;
	isOwner: boolean;
};
type IGroup = {
	name: string;
	ownerID: string;
	lastEvent: number;
	users: IGroupUser[];
};

const groupUserSchema: Schema = new Schema<IGroupUser>({
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

const groupSchema: Schema = new Schema<IGroup>({
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

export default model<IGroup>("Group", groupSchema);

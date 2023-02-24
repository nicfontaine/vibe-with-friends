import { model, Schema } from "mongoose";

const groupUserSchema = new Schema({
	uid: String,
	name: String,
	isOwner: Boolean,
});

export default model("GroupUser", groupUserSchema);

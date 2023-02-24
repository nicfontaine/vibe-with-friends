import { model, Schema } from "mongoose";

const groupUserSchema = new Schema({
	name: String,
	isOwner: Boolean,
});

export default model("GroupUser", groupUserSchema);

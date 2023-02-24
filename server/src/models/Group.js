import mongoose, { model, Schema } from "mongoose";

const groupSchema = new Schema({
	id: String,
	ownerID: String,
	lastEvent: Number,
	users: {
		type: mongoose.Schema.Types.Map,
		of: {
			name: String,
			isOwner: Boolean,
		},
	},
});

export default model("Group", groupSchema);

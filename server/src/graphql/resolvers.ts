import { ObjectId } from "mongodb";
import Group from "../models/Group";
import { IUser, IGroup, IGroupUser, IStore, ISheet } from "../types";

const resolvers = {
	Query: {
		hello: () => "Hello",
		async deleteGroup (parent: any, id: ObjectId) {
			const wasDeleted = (await Group.deleteOne({ _id: id })).deletedCount;
			return wasDeleted;
		},
	},
};

export default resolvers;

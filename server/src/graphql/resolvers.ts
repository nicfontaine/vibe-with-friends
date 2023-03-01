import { ObjectId } from "mongoose";
import Group from "../models/Group";
interface OID {
	ID: ObjectId;
}

const resolvers = {

	Query: {

		hello: () => "Hello",

		allGroups: async () => {
			return await Group.find();
		},

		async group (_: any, args: any) {
			const group = await Group.findById(args.ID);
			return group;
		},

		async groupUser (_: any, args: any) {
			const group = await Group.findById(args.ID);
			if (!group) return null;
			const user = group.users.find((e) => e.uid === args.UID);
			return user;
		},

	},

	Mutation: {

		async createGroup (_: any, args: any) {
			const { name, ownerID, lastEvent, users } = args.group;
			const group = new Group({ name, ownerID, lastEvent, users });
			await group.save();
			return group;
		},
		
		async deleteGroup (_: any, { ID }: OID) {
			await Group.findByIdAndDelete(ID);
			return `Deleted: ${ID}`;
		},

		async groupEvent (_: any, { ID }: OID) {
			const group = await Group.findById(ID);
			if (group) {
				group.lastEvent = Date.now();
				group.save();
			}
			return group;
		},

		async createGroupUser (_: any) {

		},

		async deleteGroupUser () {

		},

		async setGroupUserName () {

		},

	},

};

export default resolvers;

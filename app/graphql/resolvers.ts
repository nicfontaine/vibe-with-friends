import { ObjectId } from "mongoose";
import Group from "./models/Group";
import createGroupID from "./../util/create-group-id";
import { v4 as uuidv4 } from "uuid";
import { GroupUser } from "./types";
import { pusher } from "./index";
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
			const { user } = args;
			const group = new Group({
				name: createGroupID(),
				ownerID: user.uid || uuidv4(),
				lastEvent: Date.now(),
				users: [{ uid: user.uid, name: user.name, isOwner: true }],
			});
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

		async addGroupUser (_: any, args: any) {
			const group = await Group.findById(args.ID);
			if (group) {
				const user = group.users.find((e) => e.uid === args.user.id);
				if (!user) {
					group.users.push(args.user);
					pusher.trigger(group.name, "add-user", {
						message: group,
					});
				}
				group.lastEvent = Date.now();
				await group.save();
			}
			return group;
		},

		async deleteGroupUser (_: any, args: any) {
			const group = await Group.findById(args.ID);
			if (group) {
				const userIndex = group.users.findIndex((e) => e.uid === args.user.id);
				console.log(userIndex);
				if (userIndex >= 0) {
					group.users.splice(userIndex, 1);
					await group.save();
				}
				group.lastEvent = Date.now();
			}
			return group;
		},

		async setGroupUserName (_: any, args: any) {
			const group = await Group.findById(args.ID);
			if (group) {
				const list = group.users.map((u: GroupUser) => {
					if (u.uid === args.user.uid) u.name = args.user.name;
					return u;
				});
				group.users = list;
				group.lastEvent = Date.now();
				await group.save();
			}
			return group;
		},

		async playTapOn (_: any, args: any) {
			const { ID, user } = args;
			const group = await Group.findById(ID);
			if (group) {
				pusher.trigger(group.name, "play-tap-on", {
					message: user,
				});
				group.lastEvent = Date.now();
				await group.save();
			}
			return group;
		},

		async playTapOff (_: any, args: any) {
			const { ID, user } = args;
			const group = await Group.findById(ID);
			if (group) {
				pusher.trigger(group.name, "play-tap-off", {
					message: user,
				});
				group.lastEvent = Date.now();
				await group.save();
			}
			return group;
		},

		async playSync (_: any, args: any) {
			const { ID, sheet } = args;
			const group = await Group.findById(ID);
			if (group) {
				const start = new Date(Date.now() + 2 * 1000).toISOString();
				pusher.trigger(args.ID, "play-sync", {
					message: { start, sheet },
				});
				group.lastEvent = Date.now();
				await group.save();
			}
			return group;
		},

	},

};

export default resolvers;

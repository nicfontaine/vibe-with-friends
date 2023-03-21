import { ObjectId } from "mongoose";

type User = {
	uid: string;
	name: string;
	isOwner: boolean;
};
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
type Store = {
	[key: string]: Group;
};
type Sheet = {
	bpm: number;
	song: number[];
};
type OID = {
	ID: ObjectId;
};

export type { User, Group, GroupUser, Store, Sheet, OID };

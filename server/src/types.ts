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
type IStore = {
	[key: string]: Group;
};
type ISheet = {
	bpm: number;
	song: number[];
};

export type { User, Group, GroupUser, IStore, ISheet };

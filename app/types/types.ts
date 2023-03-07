type User = {
	uid: string;
	name: string;
	isOwner: boolean;
};
type GroupUser = {
	uid: string;
	name: string;
	playing: boolean;
};
type Group = {
	name: string,
	ownerID: string;
	users: GroupUser[];
};
type Sheet = {
	bpm: number;
	song: number[];
};

export type {
	User,
	Group,
	GroupUser,
	Sheet,
};
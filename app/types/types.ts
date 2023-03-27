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
	id: string,
	name: string,
	ownerID: string;
	users: GroupUser[];
};
type Sheet = {
	bpm: number;
	song: number[];
};
type PlayTapUser = {
	uid: string;
	name: string;
	playing: boolean;
};
type PlayTapGroup = {
	id: string;
	users: PlayTapUser[];
};

export type {
	User,
	Group,
	GroupUser,
	PlayTapUser,
	PlayTapGroup,
	Sheet,
};
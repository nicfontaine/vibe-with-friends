interface IUser {
	uid: string;
	name: string;
	isOwner: boolean;
}

interface IGroupUser {
	uid: string;
	name: string;
	playing: boolean;
}

interface IGroup {
	name: string,
	ownerID: string;
	users: IGroupUser[];
}

interface ISheet {
	bpm: number;
	song: number[];
}

export type {
	IUser,
	IGroup,
	IGroupUser,
	ISheet,
};
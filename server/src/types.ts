type IUser = {
	uid: string;
	name: string;
	isOwner: boolean;
};
type IGroupUser = {
	uid: string;
	name: string;
	isOwner: boolean;
};
type IGroup = {
	id: string;
	ownerID: string;
	lastEvent: number;
	users: IGroupUser[];
};
type IStore = {
	[key: string]: IGroup;
};
type ISheet = {
	bpm: number;
	song: number[];
};

export type { IUser, IGroup, IGroupUser, IStore, ISheet };

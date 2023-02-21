interface IUser {
	id: string;
	name: string;
	isOwner: boolean;
}

interface IGroup {
	id: string,
	ownerID: string;
	users: {
		[key: string]: {
			name: string;
			playing: boolean;
		}
	};
}

interface IGroupUser {
	[key: string]: {
		name: string;
		playing: boolean;
	}
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
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
		}
	};
}

interface IGroupUser {
	[key: string]: {
		name: string;
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
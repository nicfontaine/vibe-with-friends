import { IGroupUser, ISheet } from "./types";

interface IRPusherChangeUserName {
	message: {
		ownerID: string;
		users: IGroupUser;
	};
}

interface IRPusherAddUser {
	message: {
		ownerID: string;
		users: IGroupUser;
	}
}

interface IRPusherPlayTap {
	message: {
		uid: string;
		val: boolean;
	}
}

interface IRPusherPlaySync {
	message: {
		start: string;
		sheet: ISheet;
	}
}

export type {
	IRPusherChangeUserName,
	IRPusherAddUser,
	IRPusherPlayTap,
	IRPusherPlaySync,
};
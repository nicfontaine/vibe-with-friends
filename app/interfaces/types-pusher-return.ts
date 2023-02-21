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
		id: string;
		val: boolean;
	}
}

interface IRPusherPlaySync {
	message: ISheet
}

export type {
	IRPusherChangeUserName,
	IRPusherAddUser,
	IRPusherPlayTap,
	IRPusherPlaySync,
};
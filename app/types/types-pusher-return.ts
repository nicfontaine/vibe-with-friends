import { GroupUser, Sheet } from "./types";

interface IRPusherChangeUserName {
	message: {
		ownerID: string;
		users: GroupUser;
	};
}

interface IRPusherAddUser {
	message: {
		ownerID: string;
		users: GroupUser;
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
		sheet: Sheet;
	}
}

export type {
	IRPusherChangeUserName,
	IRPusherAddUser,
	IRPusherPlayTap,
	IRPusherPlaySync,
};
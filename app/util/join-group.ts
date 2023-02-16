interface IUser {
	[key: string]: {
		name: string;
	}
}
interface IReturn {
	userID: string;
	isOwner: boolean;
	ownerID: string;
	users: IUser;
	err?: string;
}

const joinGroup = async function (
	groupID: string,
	userID: string,
): Promise<IReturn> {
	//
	const response = await fetch("/api/group/join", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ groupID, userID }),
	});
	const res = await response.json();

	const rtn: IReturn = {
		userID: res.userID,
		isOwner: res.isOwner,
		ownerID: res.ownerID,
		users: res.users,
	};

	// Group expired, reset
	if (res.err) {
		rtn.err = res.err;
	}

	return rtn;
};

export default joinGroup;

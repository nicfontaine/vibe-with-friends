import { IUser, IGroup } from "../interfaces/types";

interface IReturn {
	user: IUser;
	group: IGroup;
	err?: string;
}

const changeUserName = async function (
	user: IUser,
	group: IGroup,
) {
	const response = await fetch("/api/group/change-username", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ user, group }),
	});
	const res: IReturn = await response.json();
	return res;
};

export default changeUserName;
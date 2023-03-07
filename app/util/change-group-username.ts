import { User, Group } from "../types/types";

interface IReturn {
	user: User;
	group: Group;
	err?: string;
}

const changeGroupUserName = async function (
	user: User,
	group: Group,
) {
	const response = await fetch("/api/group/change-username", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ user, group }),
	});
	const res: IReturn = await response.json();
	return res;
};

export default changeGroupUserName;
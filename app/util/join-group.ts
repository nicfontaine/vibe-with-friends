import { IUser, IGroup } from "../interfaces/types";

interface IReturn {
	user: IUser;
	group: IGroup;
	err?: string;
}

const joinGroup = async function (
	user: IUser,
	groupID: string,
): Promise<IReturn> {
	const response = await fetch("/api/group/join", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			user,
			group: { id: groupID },
		}),
	});
	const res: IReturn = await response.json();
	return res;
};

export default joinGroup;

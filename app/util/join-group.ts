import { User, Group } from "../types/types";

interface IReturn {
	user: User;
	group: Group;
	err?: string;
}

const joinGroup = async function (
	user: User,
	groupID: string,
): Promise<IReturn> {
	const response = await fetch("/api/group/join", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			user,
			group: { name: groupID },
		}),
	});
	const res: IReturn = await response.json();
	return res;
};

export default joinGroup;

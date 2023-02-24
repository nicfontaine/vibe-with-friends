import { IUser, IGroup } from "../interfaces/types";
interface IReturn {
	err?: string;
}

const playTapOn = async function (
	user: IUser,
	group: IGroup,
): Promise<IReturn> {
	const response = await fetch("/api/group/play-tap-on", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ user, group }),
	});
	const res = await response.json();
	return res;
};

const playTapOff = async function (
	user: IUser,
	group: IGroup,
	err?: string,
) {
	const response = await fetch("/api/group/play-tap-off", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ user, group }),
	});
	const res = await response.json();
	return res;
};

export { playTapOn, playTapOff };
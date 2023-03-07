import { User, Group } from "../types/types";
interface IReturn {
	err?: string;
}

const playTapOn = async function (
	user: User,
	group: Group,
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
	user: User,
	group: Group,
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
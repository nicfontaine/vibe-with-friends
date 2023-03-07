import { ISheet } from "../types/types";
interface IReturn {
	start: string;
	err?: string;
}

const playSync = async function (
	gid: string,
	sheet: ISheet,
): Promise<IReturn> {
	const response = await fetch("/api/group/play-sync", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ gid, sheet }),
	});
	const res = await response.json();
	return res;
};

export { playSync };
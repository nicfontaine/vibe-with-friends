import { IUser, IGroup } from "../interfaces/types";
import copyToClipboard from "./copy-to-clipboard";

interface IReturn {
	user: IUser;
	group: IGroup;
	msg?: string;
}

const share = async function (url: string): Promise<string> {
	if (navigator.share) {
		await navigator.share({
			title: process.env.NEXT_PUBLIC_APP_NAME,
			text: "Use this custom link",
			url: url,
		});
		return "";
	} else {
		copyToClipboard(url);
		return "Share URL copied to clipboard";
	}
};

const createGroup = async function (user: IUser): Promise<IReturn> {
	//
	const response = await fetch("/api/group/create", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ user: { ...user, isOwner: true } }),
	});
	const res = await response.json();
	if (res.err) {
		console.log(res.err);
	}

	// const { user, group } = res;
	const rtn: IReturn = res;
	const url = new URL(window.location.href);
	url.searchParams.set("group", rtn.group.id);
	const urlStr = url.toString();

	const msg = await share(urlStr);
	rtn.msg = msg;

	return rtn;
	//
};

export default createGroup;

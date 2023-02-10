import { MouseEvent } from "react";
import copyToClipboard from "./copy-to-clipboard";

interface IRes {
	groupID: string;
	userID: string;
	msg: string;
}

const createGroup = async function (_uid: string): Promise<IRes> {
	const response = await fetch("/api/group/create", {
		method: "POST",
		body: JSON.stringify({ userID: _uid }),
	});
	const res = await response.json();
	if (res.err) {
		console.log(res.err);
	}
	const { groupID, numberConnected } = res;
	const url = new URL(window.location.href);
	const urlStr = url.toString();
	url.searchParams.set("group", groupID);
	window.history.replaceState(null, "", url);

	const rtn = {
		groupID,
		userID: _uid || res.userID,
		msg: "",
	};

	if (navigator.share) {
		await navigator.share({
			title: process.env.NEXT_PUBLIC_APP_NAME,
			text: "Use this custom link",
			url: urlStr,
		});
	} else {
		copyToClipboard(urlStr);
		rtn.msg = "Share URL copied to clipboard";
	}

	return rtn;
};

export default createGroup;

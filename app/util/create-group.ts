import copyToClipboard from "./copy-to-clipboard";

interface IUser {
	[key: string]: {
		name: string;
	}
}
interface IRes {
	groupID: string;
	userID: string;
	users: IUser;
	msg: string;
}

const createGroup = async function (_uid: string): Promise<IRes> {
	const response = await fetch("/api/group/create", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ userID: _uid }),
	});
	const res = await response.json();
	if (res.err) {
		console.log(res.err);
	}
	const { groupID, users } = res;
	const url = new URL(window.location.href);
	url.searchParams.set("group", groupID);
	const urlStr = url.toString();

	const rtn = {
		groupID,
		users,
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

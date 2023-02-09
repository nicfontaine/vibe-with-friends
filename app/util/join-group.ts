const joinGroup = async function (
	groupID: string,
	userID: string,
): Promise<string | undefined> {
	console.log("joinGroup()");
	if (!groupID.length) {
		console.log("Must supply a group to joinGroup()");
		return;
	}
	const response = await fetch("/api/group/join", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ groupID, userID }),
	});
	const res = await response.json();
	if (res.err) console.log(res.err);
	if (res.groupID === null) {
		confirm("Friend code no longer valid");
		window.location.assign("/");
	}
	return res?.userID;
};

export default joinGroup;

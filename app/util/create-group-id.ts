import namor from "namor";

// Convert "one-two-three" to "oneTwoThree"
const createGroupID = function (): string {
	const _gid = namor.generate({ words: 3, saltLength: 0 }).split("-");
	const groupName =
		_gid.shift() + _gid.map((g) => g[0].toUpperCase() + g.slice(1)).join("");
	return groupName;
};

export default createGroupID;

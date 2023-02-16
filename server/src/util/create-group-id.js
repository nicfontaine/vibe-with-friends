import namor from "namor";

// Convert "one-two-three" to "oneTwoThree"
const createGroupID = function () {
	const _gid = namor.generate({ words: 3, saltLength: 0 }).split("-");
	const group =
		_gid.shift() + _gid.map((g) => g[0].toUpperCase() + g.slice(1)).join("");
	return group;
};

export default createGroupID;

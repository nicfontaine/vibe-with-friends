const userList = ["CHUD", "BUCK", "SPUD", "CARL", "BIFF", "GUNK", "GROB", "FLUB", "NORB", "DOOP", "BLOB", "YORB", "CLOD", "ROLP", "FOOF", "PRAG", "NURP", "GUMP", "KRUM", "DURF", "PONG", "ARGL", "SPRU", "OINK"];

const randomUsername = function (): string {
	return userList[Math.floor(Math.random() * userList.length)] + Math.floor(Math.random() * 10);
};

export default randomUsername;
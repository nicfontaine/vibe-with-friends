import { MouseEvent } from "react";
import createGroup from "../util/create-group";
import { useAppDispatch, useAppSelector } from "../app/store";
import { setIsOwner, setUserID } from "../feature/userSlice";
import { setGroupID } from "../feature/groupSlice";

interface IProps {
	setStatusMsg: (val: string) => void;
}

const BtnCreateGroup = function ({ setStatusMsg }: IProps) {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.user);

	const handleCreateGroup = async function (e: MouseEvent<HTMLButtonElement>) {
		if (e.target !== null) {
			(e.target as HTMLButtonElement).blur();
		}
		dispatch(setIsOwner(true));
		const res = await createGroup(user.id);
		const { groupID, userID } = res;
		dispatch(setGroupID(groupID));
		dispatch(setUserID(userID));
		if (res.msg) {
			setStatusMsg(res.msg);
		}
	};

	return (
		<button onClick={handleCreateGroup} className="btn-border">
			Create Group
		</button>
	);
};

export default BtnCreateGroup;

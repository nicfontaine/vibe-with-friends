import { MouseEvent } from "react";
import createGroup from "../util/create-group";
import { useAppDispatch, useAppSelector } from "../app/store";
import { setIsOwner, setUserID } from "../feature/userSlice";
import { setGroupID, setGroupOwner, addGroupUser, setGroupUsers } from "../feature/groupSlice";
import { batch } from "react-redux";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import * as PusherTypes from "pusher-js";
const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
	cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
});

interface IProps {
	setStatusMsg: (val: string) => void;
}

const BtnCreateGroup = function ({ setStatusMsg }: IProps) {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const user = useAppSelector((state) => state.user);

	const handleCreateGroup = async function (e: MouseEvent<HTMLButtonElement>) {
		if (e.target !== null) {
			(e.target as HTMLButtonElement).blur();
		}
		dispatch(setIsOwner(true));
		const res = await createGroup(user.id);
		const { groupID, userID, users } = res;

		const channel = pusher.subscribe(groupID);
		channel.bind("add-user", function (data: any) {
			dispatch(setGroupUsers(data.store.users));
		});

		batch(() => {
			dispatch(setGroupID(groupID));
			dispatch(setGroupOwner(userID));
			dispatch(setUserID(userID));
			dispatch(setGroupUsers(users));
		});
		router.push({
			query: { ...router.query, group: groupID },
		});
		if (res.msg) {
			setStatusMsg(res.msg);
		}
	};

	return (
		<button onClick={handleCreateGroup} className="btn-large btn-border">
			Create Group
		</button>
	);
};

export default BtnCreateGroup;

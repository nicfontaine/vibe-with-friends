import { MouseEvent } from "react";
import createGroup from "../util/create-group";
import { useAppDispatch, useAppSelector } from "../app/store";
import { setUserIsOwner, setUserID, setUser } from "../feature/userSlice";
import { setGroup, setGroupID, setGroupOwner, setGroupUsers } from "../feature/groupSlice";
import { batch } from "react-redux";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import * as PusherTypes from "pusher-js";
import GroupClient from "../util/group-client";
const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
	cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
});

interface IProps {
	setStatusMsg: (val: string) => void;
	size?: string;
	text?: string;
}

const BtnCreateGroup = function ({ setStatusMsg, size, text }: IProps) {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const userStore = useAppSelector((state) => state.user);

	const handleCreateGroup = async function (e: MouseEvent<HTMLButtonElement>) {
		if (e.target !== null) {
			(e.target as HTMLButtonElement).blur();
		}
		const res = await createGroup(userStore);
		const { user, group } = res;

		GroupClient.subscribe(group.id);
		GroupClient.bind("add-user", (data) => {
			dispatch(setGroupUsers(data.store.users));
		});
		GroupClient.bind("change-username", (data) => {
			dispatch(setGroupUsers(data.store.users));
		});

		batch(() => {
			dispatch(setUser(user));
			dispatch(setGroup(group));
		});
		router.push({
			query: { ...router.query, group: group.id },
		});
		if (res.msg) {
			setStatusMsg(res.msg);
		}
	};

	return (
		<button
			onClick={handleCreateGroup}
			className={`btn-${size || "med"} btn-border`}
		>
			{text || "Create Group"}
		</button>
	);
};

export default BtnCreateGroup;

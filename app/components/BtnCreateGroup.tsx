import { MouseEvent, useEffect } from "react";
import createGroup from "../util/create-group";
import { useAppDispatch, useAppSelector } from "../app/store";
import { setUser } from "../feature/userSlice";
import { setGroup, setGroupUserPlaying, setGroupUsers } from "../feature/groupSlice";
import { batch } from "react-redux";
import { useRouter } from "next/router";
import SyncPlayer from "../util/sync-player";
import * as PusherTypes from "pusher-js";
import { IRPusherAddUser, IRPusherChangeUserName, IRPusherPlayTap } from "../interfaces/types-pusher-return";

interface IProps {
	setStatusMsg: (val: string) => void;
	size?: string;
	text?: string;
	pusher: PusherTypes.default;
}

const BtnCreateGroup = function ({ setStatusMsg, size, text, pusher }: IProps) {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const userStore = useAppSelector((state) => state.user);

	const handleCreateGroup = async function (e: MouseEvent<HTMLButtonElement>) {
		if (e.target !== null) {
			(e.target as HTMLButtonElement).blur();
		}
		const res = await createGroup(userStore);
		const { user, group } = res;

		pusher.subscribe(group.id);
		pusher.bind("add-user", (data: IRPusherAddUser) => {
			dispatch(setGroupUsers(data.message.users));
		});
		pusher.bind("change-username", (data: IRPusherChangeUserName) => {
			dispatch(setGroupUsers(data.message.users));
		});
		pusher.bind("play-tap-on", (data: IRPusherPlayTap) => {
			dispatch(setGroupUserPlaying({ userID: data.message.id, val: true }));
			SyncPlayer.on(Infinity);
		});
		pusher.bind("play-tap-off", (data: IRPusherPlayTap) => {
			dispatch(setGroupUserPlaying({ userID: data.message.id, val: false }));
			SyncPlayer.off();
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

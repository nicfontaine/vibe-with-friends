import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, batch } from "react-redux";
import { useAppSelector } from "../app/store";
import joinGroup from "../util/join-group";
import { deleteGroup, setGroup, setGroupUserPlaying, setGroupUsers } from "../feature/groupSlice";
import { setUser } from "../feature/userSlice";
import UserName from "./UserName";
import SyncPlayer from "../util/sync-player";
import { ISheet } from "../interfaces/types";

interface IProps {
	setStatusMsg: (val: string) => void;
	showUserName: boolean;
	setShowUserName: (val: boolean) => void;
	pusher: any;
}

const UserGroupJoin = function ({ setStatusMsg, showUserName, setShowUserName, pusher }: IProps) {

	const router = useRouter();
	const dispatch = useDispatch();

	const userStore = useAppSelector((state) => state.user);

	useEffect(() => {
		if (checkURL()) {
			// Prompt username on load
			if (!userStore.name) {
				setShowUserName(true);
			}
		} else {
			pusher.channel?.unbind();
			pusher.unsubscribe();
			pusher.disconnect();
		}
	}, []);

	// Join URL group
	useEffect(() => {
		if (userStore.name) {
			const g = checkURL();
			if (g) join(g);
		}
	}, [userStore.name]);

	const checkURL = function (): string {
		const params = new URLSearchParams(window.location.search);
		const g = params.get("group") || "";
		return g;
	};

	const player = async (sheet: ISheet): Promise<void> => {
		await SyncPlayer.play(sheet);
	};

	const join = async function (gid: string): Promise<void> {
		const res = await joinGroup(userStore, gid);
		if (res.err) {
			router.push("/", undefined, { shallow: true });
			dispatch(deleteGroup(gid));
			setStatusMsg(res.err);
			return;
		}
		const { user, group } = res;
		batch(() => {
			dispatch(setUser(user));
			dispatch(setGroup(group));
		});
		pusher.subscribe(group.id);
		pusher.bind("add-user", (data) => {
			dispatch(setGroupUsers(data.message.users));
		});
		pusher.bind("change-username", (data) => {
			dispatch(setGroupUsers(data.message.users));
		});
		pusher.bind("play-tap-on", (data) => {
			if (data.message.id !== user.id) {
				dispatch(setGroupUserPlaying({ userID: data.message.id, val: true }));
				SyncPlayer.on(Infinity);
			}
		});
		pusher.bind("play-tap-off", (data) => {
			if (data.message.id !== user.id) {
				dispatch(setGroupUserPlaying({ userID: data.message.id, val: false }));
				SyncPlayer.off();
			}
		});
		if (!user.isOwner) {
			pusher.bind("play-sync", (data) => {
				player(data.message);
			});
		}
	};

	return (
		<>
			<div className={`user-group-join ${showUserName ? "show" : ""}`}>
				<UserName showUserName={showUserName} setShowUserName={setShowUserName}></UserName>
			</div>
		</>
	);

};

export default UserGroupJoin;
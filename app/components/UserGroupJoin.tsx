import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, batch } from "react-redux";
import { useAppSelector } from "../app/store";
import joinGroup from "../util/join-group";
import GroupClient from "../util/group-client";
import { deleteGroup, setGroup, setGroupUsers } from "../feature/groupSlice";
import { setUser } from "../feature/userSlice";
import UserName from "./UserName";
import SyncPlayer from "../util/sync-player";
import { ISheet } from "../interfaces/types";

interface IProps {
	setStatusMsg: (val: string) => void;
	showUserName: boolean;
	setShowUserName: (val: boolean) => void;
}

const UserGroupJoin = function ({ setStatusMsg, showUserName, setShowUserName }: IProps) {

	const router = useRouter();
	const dispatch = useDispatch();

	const userStore = useAppSelector((state) => state.user);

	// Prompt username on load
	useEffect(() => {
		if (checkURL() && !userStore.name) {
			setShowUserName(true);
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
		const p = new SyncPlayer(sheet);
		await p.play();
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
		GroupClient.subscribe(group.id);
		GroupClient.bind("add-user", (data) => {
			dispatch(setGroupUsers(data.store.users));
		});
		GroupClient.bind("change-username", (data) => {
			dispatch(setGroupUsers(data.store.users));
		});
		if (!user.isOwner) {
			GroupClient.bind("play-sync", (data) => {
				player(data.sheet);
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
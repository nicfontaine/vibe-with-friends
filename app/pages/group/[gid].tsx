import { useEffect, useState } from "react";
import { useDispatch, batch } from "react-redux";
import Head from "next/head";
import { useRouter } from "next/router";
import NavMain from "../../components/NavMain";
import UserNameDialog from "../../components/UserNameDialog";
import { setDialogUserName } from "../../feature/dialogSlice";
import { useAppSelector } from "../../app/store";
import { deleteGroup, setGroup, setGroupUserPlaying, setGroupUsers } from "../../feature/groupSlice";
import { setUser } from "../../feature/userSlice";
import { IRPusherAddUser, IRPusherChangeUserName, IRPusherPlaySync, IRPusherPlayTap } from "../../types/types-pusher-return";
import { setPlaySyncLoading, setStatusMsg } from "../../feature/statusSlice";
import VibePlayer from "../../util/vibe-player";
import { Sheet } from "../../types/types";
import JoinGroupDialog from "../../components/JoinGroupDialog";
import UsersGrid from "../../components/UsersGrid";
import BtnPlayTap from "../../components/BtnPlayTap";
import BtnCreateGroup from "../../components/BtnCreateGroup";
import BtnPlaySync from "../../components/BtnPlaySync";
import Pusher from "pusher-js";
import { useMutation } from "@apollo/client";
import ADD_GROUP_USER from "../../apollo/mutations/AddGroupUser";
// Pusher.logToConsole = true;
const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
	cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
});

const Group = function () {

	const dispatch = useDispatch();
	const router = useRouter();
	const { gid } = router.query;

	const userStore = useAppSelector((state) => state.user);
	const groupStore = useAppSelector((state) => state.group);

	const [isTapPlaying, setIsTapPlaying] = useState(false);

	useEffect(() => {
		console.log("name change: " + userStore.name);
	}, [userStore.name]);

	useEffect(() => {
		// pusher.unbind();
		// pusher.unsubscribe(groupStore.name);
		// pusher.disconnect();
		return () => {
			console.log("[gid] unmount");
		};
	}, []);
	
	useEffect(() => {
		if (!gid) return;
		if (!userStore.name) {
			dispatch(setDialogUserName(true));
			return;
		}
		join(gid.toString());
	}, [gid]);

	useEffect(() => {
		if (userStore.name) {
			if (gid && !groupStore.name.length) {
				console.log(groupStore.name);
				join(gid.toString());
			}
		}
	}, [userStore.name]);

	const [addGroupUser, { data, loading, error }] = useMutation(ADD_GROUP_USER);

	if (loading) {
		// TODO: Loading icon
		console.log("Loading...");
	}
	if (error) {
		dispatch(setStatusMsg(error.message));
		dispatch(deleteGroup());
		router.push("/", undefined, { shallow: true });
		return;
	}
	if (data) {

		const { user, group } = data.addGroupUser;
		batch(() => {
			console.log("addGroupUser (GQL)");
			dispatch(setUser(user));
			dispatch(setGroup(group));
		});

		const channel = pusher.subscribe(group.name);

		// TODO: Cleanup
		channel.bind("add-user", (data: IRPusherAddUser) => {
			dispatch(setGroupUsers(data.message.users));
		});
		channel.bind("change-username", (data: IRPusherChangeUserName) => {
			dispatch(setGroupUsers(data.message.users));
		});
		channel.bind("play-tap-on", (data: IRPusherPlayTap) => {
			if (data.message.uid !== user.uid) {
				dispatch(setGroupUserPlaying({ uid: data.message.uid, val: true }));
				VibePlayer.on(Infinity);
			}
		});
		channel.bind("play-tap-off", (data: IRPusherPlayTap) => {
			if (data.message.uid !== user.uid) {
				dispatch(setGroupUserPlaying({ uid: data.message.uid, val: false }));
				VibePlayer.off();
			}
		});
		channel.bind("play-sync", (data: IRPusherPlaySync) => {
			const { start } = data.message;
			dispatch(setPlaySyncLoading(true));
			const delta = (new Date(start)).getTime() - Date.now();
			console.log(`Running in ${delta} ms, at ${start}`);
			setTimeout(() => {
				player(data.message.sheet);
				dispatch(setPlaySyncLoading(false));
			}, delta);
		});
	}

	const join = async function (gid: string): Promise<void> {
		addGroupUser({
			variables: { 
				groupName: gid,
				user: userStore,
			},
		});
	};

	const player = async (sheet: Sheet): Promise<void> => {
		await VibePlayer.play(sheet);
	};

	let pageTitle = process.env.NEXT_PUBLIC_APP_NAME;
	if (groupStore.name) pageTitle = `${pageTitle} - ${groupStore.name}`;

	return (
		<>
			
			<Head>
				<title>{pageTitle}</title>
			</Head>

			<NavMain />
			
			<UsersGrid
				isTapPlaying={isTapPlaying}
			/>

			<div className="main-bottom">
				<div className="hide-larger-med">
					<div className="d-flx button-container">
						<BtnCreateGroup
							size="med"
							text="New Group"
						></BtnCreateGroup>
						<BtnPlaySync></BtnPlaySync>
					</div>
				</div>
				<BtnPlayTap
					setIsTapPlaying={setIsTapPlaying}
				/>
			</div>

			<UserNameDialog maxWidth={250} />
			<JoinGroupDialog maxWidth={350} />
		</>
	);

};

export default Group;
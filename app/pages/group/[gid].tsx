import { useEffect, useState } from "react";
import { useDispatch, batch } from "react-redux";
import Head from "next/head";
import { useRouter } from "next/router";
import NavMain from "../../components/NavMain";
import UserNameDialog from "../../components/UserNameDialog";
import { setDialogUserName } from "../../feature/dialogSlice";
import { useAppSelector } from "../../app/store";
import { setPlayGroup, setGroupUserPlaying } from "../../feature/playTapSlice";
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
import { PuffLoader } from "react-spinners";
// Pusher.logToConsole = true;
const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
	cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
});

const GroupPage = function () {

	const dispatch = useDispatch();
	const router = useRouter();
	const { gid } = router.query;

	let pageTitle = process.env.NEXT_PUBLIC_APP_NAME;
	const userStore = useAppSelector((state) => state.user);
	const [isTapPlaying, setIsTapPlaying] = useState(false);

	const [addGroupUser, { data, loading, error }] = useMutation(ADD_GROUP_USER);

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

	// Join group if user changes name, and not already in GID group
	useEffect(() => {
		if (userStore.name) {
			if (gid && data?.addGroupUser?.group && !data?.addGroupUser?.group?.name.length) {
				console.log(data.addGroupUser.group.name);
				join(gid.toString());
			}
		}
	}, [userStore.name]);

	if (error) {
		dispatch(setStatusMsg(error.message));
		// dispatch(deleteGroup());
		router.push("/", undefined, { shallow: true });
		return;
	}
	
	useEffect(() => {
		if (!data) return;
		const { user, group } = data.addGroupUser;
		dispatch(setUser(user));
		dispatch(setPlayGroup(group));
		if (group?.name) pageTitle = `${pageTitle} - ${group.name}`;

		const channel = pusher.subscribe(group.name);

		// TODO: Cleanup
		channel.bind("add-user", (data: IRPusherAddUser) => {
			dispatch(setPlayGroup(data.message));
		});
		channel.bind("change-username", (data: IRPusherChangeUserName) => {
			dispatch(setPlayGroup(data.message));
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
	}, [data]);

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

	return (
		<>
			
			<Head>
				<title>{pageTitle}</title>
			</Head>

			{loading ? (
				<>
					<div className="loading-center mg-t-10">
						<PuffLoader color="#aaaaaa" size={70} className="center loading-spinner" />
					</div>
				</>
			) : null}

			{data?.addGroupUser?.group ? (
				<>
					
					<NavMain group={data?.addGroupUser?.group} />

					<UsersGrid
						group={data.addGroupUser.group}
						isTapPlaying={isTapPlaying}
					/>

					<div className="main-bottom">
						<div className="hide-larger-med">
							<div className="d-flx button-container">
								<BtnCreateGroup
									size="med"
									text="New Group"
								></BtnCreateGroup>
								<BtnPlaySync group={data.addGroupUser.group}></BtnPlaySync>
							</div>
						</div>
						<BtnPlayTap
							group={data.addGroupUser.group}
							setIsTapPlaying={setIsTapPlaying}
						/>
					</div>

					<JoinGroupDialog maxWidth={350} />
				</>
			) : null}

			<UserNameDialog group={data?.addGroupUser?.group} maxWidth={250} />
			
		</>
	);

};

export default GroupPage;
import { useEffect, useState } from "react";
import { useDispatch, batch } from "react-redux";
import { useRouter } from "next/router";
import NavMain from "../../components/NavMain";
import UserNameDialog from "../../components/UserNameDialog";
import { setDialogUserName } from "../../feature/dialogSlice";
import { useAppSelector } from "../../app/store";
import joinGroup from "../../util/join-group";
import { deleteGroup, setGroup, setGroupUserPlaying, setGroupUsers } from "../../feature/groupSlice";
import { setUser } from "../../feature/userSlice";
import { IRPusherAddUser, IRPusherChangeUserName, IRPusherPlaySync, IRPusherPlayTap } from "../../interfaces/types-pusher-return";
import { setStatusMsg } from "../../feature/statusSlice";
import SyncPlayer from "../../util/sync-player";
import { ISheet } from "../../interfaces/types";
import JoinGroupDialog from "../../components/JoinGroupDialog";
import UsersGrid from "../../components/UsersGrid";
import BtnPlayTap from "../../components/BtnPlayTap";
import BtnCreateGroup from "../../components/BtnCreateGroup";
import BtnPlaySync from "../../components/BtnPlaySync";
import Pusher from "pusher-js";
// import * as PusherTypes from "pusher-js";
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
		// pusher.unbind();
		// pusher.unsubscribe(groupStore.id);
		// pusher.disconnect();
		// return () => {
		// 	pusher.unbind();
		// 	pusher.unsubscribe(groupStore.id);
		// 	pusher.disconnect();
		// };
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
			if (gid && !groupStore.id) {
				join(gid.toString());
			}
		}
	}, [userStore.name]);

	const join = async function (gid: string): Promise<void> {
		//
		const res = await joinGroup(userStore, gid);
		if (res.err) {
			dispatch(deleteGroup(gid));
			dispatch(setStatusMsg(res.err));
			router.push("/", undefined, { shallow: true });
			return;
		}
		const { user, group } = res;
		batch(() => {
			dispatch(setUser(user));
			dispatch(setGroup(group));
		});

		const channel = pusher.subscribe(group.id);

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
				SyncPlayer.on(Infinity);
			}
		});
		channel.bind("play-tap-off", (data: IRPusherPlayTap) => {
			if (data.message.uid !== user.uid) {
				dispatch(setGroupUserPlaying({ uid: data.message.uid, val: false }));
				SyncPlayer.off();
			}
		});
		channel.bind("play-sync", (data: IRPusherPlaySync) => {
			const { start } = data.message;
			const delta = (new Date(start)).getTime() - Date.now();
			// console.log(`Start: ${data.message.start}`);
			console.log(`Running in ${delta} ms, at ${start}`);
			setTimeout(() => {
				player(data.message.sheet);
			}, delta);
		});
	};

	const player = async (sheet: ISheet): Promise<void> => {
		await SyncPlayer.play(sheet);
	};

	return (
		<>
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
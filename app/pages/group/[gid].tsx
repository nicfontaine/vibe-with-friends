import { useEffect } from "react";
import { useDispatch, batch } from "react-redux";
import { useRouter } from "next/router";
import NavMain from "../../components/NavMain";
import * as PusherTypes from "pusher-js";
import UserNameDialog from "../../components/UserNameDialog";
import { setDialogJoinGroup, setDialogUserName } from "../../feature/dialogSlice";
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

interface IProps {
	pusher: PusherTypes.default;
}

const Group = function ({ pusher }: IProps) {

	const dispatch = useDispatch();
	const router = useRouter();
	const { gid } = router.query;

	const userStore = useAppSelector((state) => state.user);
	const groupStore = useAppSelector((state) => state.group);

	useEffect(() => {
		return () => {
			pusher.unbind();
			pusher.unsubscribe(groupStore.id);
			pusher.disconnect();
		};
	}, []);
	
	useEffect(() => {
		if (!gid) return;
		if (!userStore.name) {
			dispatch(setDialogUserName(true));
			return;
		}
		// if (!userStore.isOwner) {
		console.log("join");
		join(gid.toString());
		// }
	}, [gid]);

	useEffect(() => {
		if (userStore.name) {
			if (gid && !groupStore.id) {
				console.log("join");
				join(gid.toString());
			}
		}
	}, [userStore.name]);

	const join = async function (gid: string): Promise<void> {
		//
		const res = await joinGroup(userStore, gid);
		if (res.err) {
			router.push("/", undefined, { shallow: true });
			dispatch(deleteGroup(gid));
			dispatch(setStatusMsg(res.err));
			return;
		}
		const { user, group } = res;
		batch(() => {
			dispatch(setUser(user));
			dispatch(setGroup(group));
		});

		pusher.subscribe(group.id);
		// TODO: Cleanup
		pusher.bind("add-user", (data: IRPusherAddUser) => {
			console.log("add user");
			dispatch(setGroupUsers(data.message.users));
		});
		pusher.bind("change-username", (data: IRPusherChangeUserName) => {
			console.log("change username");
			dispatch(setGroupUsers(data.message.users));
		});
		pusher.bind("play-tap-on", (data: IRPusherPlayTap) => {
			console.log("play tap on");
			if (data.message.id !== user.id) {
				dispatch(setGroupUserPlaying({ userID: data.message.id, val: true }));
				SyncPlayer.on(Infinity);
			}
		});
		pusher.bind("play-tap-off", (data: IRPusherPlayTap) => {
			if (data.message.id !== user.id) {
				dispatch(setGroupUserPlaying({ userID: data.message.id, val: false }));
				SyncPlayer.off();
			}
		});
		if (!user.isOwner) {
			pusher.bind("play-sync", (data: IRPusherPlaySync) => {
				player(data.message);
			});
		}
	};

	const player = async (sheet: ISheet): Promise<void> => {
		await SyncPlayer.play(sheet);
	};

	return (
		<>
			<NavMain pusher={pusher} />
			<UsersGrid />
			<BtnPlayTap />

			<UserNameDialog maxWidth={250} />
			<JoinGroupDialog maxWidth={350} />
		</>
	);

};

export default Group;
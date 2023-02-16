import { useEffect, useState, MouseEvent } from "react";
import { useRouter } from "next/router";
import { batch } from "react-redux";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import { RiAdminLine } from "react-icons/ri";
import PlayerBox from "../components/PlayerBox";
import BtnCreateGroup from "../components/BtnCreateGroup";
import StatusMsg from "../components/StatusMsg";
import joinGroup from "../util/join-group";
import { setIsOwner, setUserID } from "../feature/userSlice";
import { useAppDispatch, useAppSelector } from "../app/store";
import { addGroupUser, deleteGroup, setGroupID, setGroupOwner, setGroupUsers } from "../feature/groupSlice";
// import Pusher from 'pusher-js/with-encryption';
import Pusher from "pusher-js";
import * as PusherTypes from "pusher-js";
import UsersGrid from "../components/UsersGrid";
import Callback from "pusher-js/types/src/core/events/callback";
const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
	cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
});
// Pusher.logToConsole = true;

const Home = function () {
	//
	const router = useRouter();
	const [statusMsg, setStatusMsg] = useState("");
	
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.user);
	const group = useAppSelector((state) => state.group);

	const joinGroupOnLoad = async function (
		groupID: string,
		userID: string,
	): Promise<void> {
		const res = await joinGroup(groupID, userID);
		if (res.err) {
			router.push("/", undefined, { shallow: true });
			dispatch(deleteGroup(groupID));
			setStatusMsg(res.err);
			return;
		}
		batch(() => {
			// TODO: Cleanup to just: { _user, _group }
			dispatch(setIsOwner(res.isOwner));
			dispatch(setUserID(res.userID));
			
			dispatch(setGroupID(groupID));
			dispatch(setGroupOwner(res.ownerID));
			dispatch(setGroupUsers(res.users));
		});
		const channel = pusher.subscribe(groupID);
		channel.bind("add-user", function (data: any) {
			dispatch(setGroupUsers(data.store.users));
		});
	};

	useEffect(() => {
		setStatusMsg("");
		// Check URL for group to join
		const params = new URLSearchParams(window.location.search);
		const urlGroupID = params.get("group") || "";
		if (!urlGroupID.length) {
			if (group.id) {
				router.push({
					query: { ...router.query, group: group.id },
				});
			}
			return;
		}
		joinGroupOnLoad(urlGroupID, user.id);
	}, []);

	const handleButtonHome = function (e: MouseEvent<HTMLButtonElement>): void {
		batch(() => {
			dispatch(deleteGroup(group.id));
			dispatch(setIsOwner(false));
		});
		router.push({ href: "/" });
	};

	const handleButtonUser = function (e: MouseEvent<HTMLButtonElement>): void {
		//
	};

	return (
		<>
			<nav className="nav-main">
				<div className="home-container">
					<button onClick={handleButtonHome} className="nav-btn nav-icon-home">
						<AiOutlineHome color="#633796" size="2.7rem" />
					</button>
				</div>
				<h1 className="heading">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
				<div className="button-container">
					<PlayerBox isOwner={user.isOwner} groupID={group.id}></PlayerBox>
					<button onClick={handleButtonUser} className="nav-btn nav-icon-user">
						{user.isOwner == true ? (
							<RiAdminLine color="#633796" size="2.7rem" />
						) : (
							<AiOutlineUser color="#633796" size="2.7rem" />
						)}
					</button>
				</div>
			</nav>

			<main style={{ textAlign: "center" }}>
				{group.id && (
					<div className="d-flx">
						<span className="icon mg-r-6 d-flx flx-items-ctr">
							<HiOutlineUserGroup size="40"></HiOutlineUserGroup>
						</span>
						<code className="text-code allselect pd-a-2 pd-r-3 pd-l-3 rnd-8">
							{group.id}
						</code>
					</div>
				)}

				<div className="button-container">
					{!group.id.length && (
						<BtnCreateGroup setStatusMsg={setStatusMsg}></BtnCreateGroup>
					)}
				</div>

				<UsersGrid />

				<StatusMsg statusMsg={statusMsg} setStatusMsg={setStatusMsg} />
			</main>
		</>
	);
};

export default Home;

import { useEffect, useState, MouseEvent } from "react";
import { useRouter } from "next/router";
import { batch } from "react-redux";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import { RiAdminLine } from "react-icons/ri";
import BtnCreateGroup from "../components/BtnCreateGroup";
import StatusMsg from "../components/StatusMsg";
import { setUserIsOwner } from "../feature/userSlice";
import { useAppDispatch, useAppSelector } from "../app/store";
import { deleteGroup } from "../feature/groupSlice";
import UsersGrid from "../components/UsersGrid";
import BtnPlaySync from "../components/BtnPlaySync";
import UserGroupJoin from "../components/UserGroupJoin";
import BtnPlayTap from "../components/BtnPlayTap";
import * as PusherTypes from "pusher-js";
interface IProps {
	pusher: PusherTypes.default;
}
const Home = function ({ pusher }: IProps) {
	//
	const router = useRouter();
	const [statusMsg, setStatusMsg] = useState("");
	const [showUserName, setShowUserName] = useState(false);
	
	const dispatch = useAppDispatch();
	const userStore = useAppSelector((state) => state.user);
	const groupStore = useAppSelector((state) => state.group);

	useEffect(() => {
		setStatusMsg("");
		return () => {
			pusher.unbind();
			pusher.unsubscribe(groupStore.id);
			pusher.disconnect();
		};
	}, []);

	const handleButtonHome = function (e: MouseEvent<HTMLButtonElement>): void {
		batch(() => {
			dispatch(deleteGroup(groupStore.id));
			dispatch(setUserIsOwner(false));
		});
		router.push({ href: "/" });
	};

	const handleButtonUser = function (e: MouseEvent<HTMLButtonElement>): void {
		setShowUserName(true);
	};

	return (
		<>
			<nav className="nav-main">

				<div className="button-container left">
					<button onClick={handleButtonHome} className="nav-btn nav-icon-home mg-r-4">
						<AiOutlineHome className="icon-main" size="45" />
					</button>
					{groupStore.id.length ? (
						<BtnCreateGroup
							setStatusMsg={setStatusMsg}
							size="med"
							text="New Group"
							pusher={pusher}
						></BtnCreateGroup>
					) : null}
				</div>

				<h1 className="heading">{process.env.NEXT_PUBLIC_APP_NAME}</h1>

				<div className="button-container right">
					<BtnPlaySync></BtnPlaySync>
					<button onClick={handleButtonUser} className="nav-btn nav-icon-user">
						{userStore.isOwner == true ? (
							<RiAdminLine className="icon-main" size="45" />
						) : (
							<AiOutlineUser className="icon-main" size="45" />
						)}
						{userStore.name && <span className="user-name">{userStore.name}</span>}
					</button>
				</div>

			</nav>

			<main style={{ textAlign: "center" }}>

				{groupStore.id && (
					<div className="d-flx">
						<span className="icon mg-r-6 d-flx flx-items-ctr">
							<HiOutlineUserGroup size="40"></HiOutlineUserGroup>
						</span>
						<code className="text-code allselect pd-a-2 pd-r-3 pd-l-3 rnd-8">
							{groupStore.id}
						</code>
					</div>
				)}

				<div className="button-container">
					{!groupStore.id.length && (
						<BtnCreateGroup
							setStatusMsg={setStatusMsg}
							size="large"
							pusher={pusher}
						></BtnCreateGroup>
					)}
				</div>

				<UserGroupJoin
					setStatusMsg={setStatusMsg}
					showUserName={showUserName}
					setShowUserName={setShowUserName}
					pusher={pusher}
				/>
				
				<UsersGrid />

				<BtnPlayTap />

				<StatusMsg statusMsg={statusMsg} setStatusMsg={setStatusMsg} />

			</main>
		</>
	);
};

export default Home;

import { useEffect, useState, MouseEvent } from "react";
import { useRouter } from "next/router";
import { batch } from "react-redux";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import { RiAdminLine } from "react-icons/ri";
import BtnCreateGroup from "../components/BtnCreateGroup";
import StatusMsg from "../components/StatusMsg";
import { setUserIsOwner, setUser } from "../feature/userSlice";
import { useAppDispatch, useAppSelector } from "../app/store";
import { deleteGroup, setGroup, setGroupUsers } from "../feature/groupSlice";
import UsersGrid from "../components/UsersGrid";
import BtnPlaySync from "../components/BtnPlaySync";
import UserGroupJoin from "../components/UserGroupJoin";

const Home = function () {
	//
	const router = useRouter();
	const [statusMsg, setStatusMsg] = useState("");
	const [showUserName, setShowUserName] = useState(false);
	
	const dispatch = useAppDispatch();
	const userStore = useAppSelector((state) => state.user);
	const groupStore = useAppSelector((state) => state.group);

	useEffect(() => {
		setStatusMsg("");
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
						<AiOutlineHome color="#633796" size="2.7rem" />
					</button>
					{groupStore.id.length ? (
						<BtnCreateGroup
							setStatusMsg={setStatusMsg}
							size="med"
							text="New Group"
						></BtnCreateGroup>
					) : null}
				</div>

				<h1 className="heading">{process.env.NEXT_PUBLIC_APP_NAME}</h1>

				<div className="button-container right">
					<BtnPlaySync></BtnPlaySync>
					<button onClick={handleButtonUser} className="nav-btn nav-icon-user">
						{userStore.isOwner == true ? (
							<RiAdminLine color="#633796" size="2.7rem" />
						) : (
							<AiOutlineUser color="#633796" size="2.7rem" />
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
						<BtnCreateGroup setStatusMsg={setStatusMsg} size="large"></BtnCreateGroup>
					)}
				</div>

				<UserGroupJoin
					setStatusMsg={setStatusMsg}
					showUserName={showUserName}
					setShowUserName={setShowUserName}
				/>
				
				<UsersGrid />

				<StatusMsg statusMsg={statusMsg} setStatusMsg={setStatusMsg} />

			</main>
		</>
	);
};

export default Home;

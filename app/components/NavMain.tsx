import { MouseEvent, useEffect, useState } from "react";
import BtnPlaySync from "../components/BtnPlaySync";
import BtnCreateGroup from "./BtnCreateGroup";
import { useRouter } from "next/router";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { RiAdminLine } from "react-icons/ri";
import { useAppSelector } from "../app/store";
import { batch, useDispatch } from "react-redux";
import { setUserIsOwner } from "../feature/userSlice";
import { deleteGroup } from "../feature/groupSlice";
import { setDialogUserName } from "../feature/dialogSlice";
import { HiOutlineUserGroup } from "react-icons/hi";
import StatusMsg from "./StatusMsg";
import copyToClipboard from "../util/copy-to-clipboard";
import { setStatusMsg } from "../feature/statusSlice";

const NavMain = function () {

	const dispatch = useDispatch();
	const router = useRouter();
	const userStore = useAppSelector((state) => state.user);
	const groupStore = useAppSelector((state) => state.group);
	const [groupDisplayString, setGroupDisplayString] = useState("");

	useEffect(() => {
		dispatch(deleteGroup());
	}, []);

	useEffect(() => {
		if (!groupStore.name.length) return;
		let i = 1;
		const t = setInterval(() => {
			if (i >= groupStore.name.length) clearInterval(t);
			setGroupDisplayString(groupStore.name.substring(0, i));
			i++;
		}, 20);
	}, [groupStore.name]);

	const handleButtonHome = function (e: MouseEvent<HTMLButtonElement>): void {
		batch(() => {
			dispatch(deleteGroup());
			dispatch(setUserIsOwner(false));
		});
		router.push({ pathname: "/" });
	};

	const handleButtonUser = function (e: MouseEvent<HTMLButtonElement>): void {
		dispatch(setDialogUserName(true));
	};

	const handleGroupCopy = function (): void {
		copyToClipboard(groupStore.name);
		dispatch(setStatusMsg("Copied Group Name"));
	};

	return (
		<>
			
			<StatusMsg />

			<nav className="nav-main">

				<div className="button-container left">
					<button
						onClick={handleButtonHome}
						className="nav-btn nav-icon-home"
					>
						<AiOutlineHome className="icon-main" size="45" />
					</button>
					{groupStore.name.length ? (
						<div className="hide-smaller-med align-center mg-l-4">
							<BtnCreateGroup
								size="med"
								text="New Group"
							></BtnCreateGroup>
						</div>
					) : null}
				</div>
					
				<div className="center">
					<h1 className="heading">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
					{groupStore.name && (
						<div className="nav-group-code">
							<span className="icon mg-r-2 d-flx flx-items-ctr">
								<HiOutlineUserGroup size="20"></HiOutlineUserGroup>
							</span>
							<div
								className="group"
								onClick={handleGroupCopy}
							>{groupDisplayString}</div>
						</div>
					)}
				</div>

				<div className="button-container right">
					<div className="hide-smaller-med align-center mg-r-4">
						<BtnPlaySync></BtnPlaySync>
					</div>
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
		</>
	);

};

export default NavMain;
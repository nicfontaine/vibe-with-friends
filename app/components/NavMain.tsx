import { MouseEvent } from "react";
import BtnPlaySync from "../components/BtnPlaySync";
import BtnCreateGroup from "./BtnCreateGroup";
import { useRouter } from "next/router";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { RiAdminLine } from "react-icons/ri";
import { useAppSelector } from "../app/store";
import { batch, useDispatch } from "react-redux";
import { setUserIsOwner } from "../feature/userSlice";
import { deleteGroup } from "../feature/groupSlice";
import * as PusherTypes from "pusher-js";
import { setDialogUserName } from "../feature/dialogSlice";
import { HiOutlineUserGroup } from "react-icons/hi";
import StatusMsg from "./StatusMsg";

interface IProps {
	pusher: PusherTypes.default;
}

const NavMain = function ({ pusher }: IProps) {

	const dispatch = useDispatch();
	const router = useRouter();
	const userStore = useAppSelector((state) => state.user);
	const groupStore = useAppSelector((state) => state.group);

	const handleButtonHome = function (e: MouseEvent<HTMLButtonElement>): void {
		batch(() => {
			dispatch(deleteGroup(groupStore.id));
			dispatch(setUserIsOwner(false));
		});
		router.push({ pathname: "/" });
	};

	const handleButtonUser = function (e: MouseEvent<HTMLButtonElement>): void {
		dispatch(setDialogUserName(true));
	};

	return (
		<>
			
			<StatusMsg />

			<nav className="nav-main">

				<div className="button-container left">
					<button onClick={handleButtonHome} className="nav-btn nav-icon-home mg-r-4">
						<AiOutlineHome className="icon-main" size="45" />
					</button>
					{groupStore.id.length ? (
						<BtnCreateGroup
							size="med"
							text="New Group"
							pusher={pusher}
						></BtnCreateGroup>
					) : null}
				</div>
					
				<div className="center">
					<h1 className="heading">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
					{groupStore.id && (
						<div className="nav-group-code">
							<span className="icon mg-r-2 d-flx flx-items-ctr">
								<HiOutlineUserGroup size="20"></HiOutlineUserGroup>
							</span>
							<div className="group">{groupStore.id}</div>
						</div>
					)}
				</div>

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
		</>
	);

};

export default NavMain;
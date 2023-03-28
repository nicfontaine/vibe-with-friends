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
import { setDialogUserName } from "../feature/dialogSlice";
import StatusMsg from "./StatusMsg";
import { Group } from "../types/types";
import NavGroupCode from "./NavGroupCode";

interface IProps {
	group?: Group
}

const NavMain = function ({ group }: IProps) {

	const dispatch = useDispatch();
	const router = useRouter();
	const userStore = useAppSelector((state) => state.user);

	// useEffect(() => {
	// 	dispatch(deleteGroup());
	// }, []);

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
					{group?.name.length ? (
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
					{group?.name ? <NavGroupCode group={group} /> : undefined}
				</div>

				<div className="button-container right">
					<div className="hide-smaller-med align-center mg-r-4">
						<BtnPlaySync group={group}></BtnPlaySync>
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
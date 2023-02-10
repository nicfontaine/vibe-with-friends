import { MouseEvent } from "react";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import { RiAdminLine } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import PlayerBox from "../components/PlayerBox";
import BtnCreateGroup from "../components/BtnCreateGroup";
import joinGroup from "../util/join-group";
import { setIsOwner, setUserID } from "../feature/userSlice";
import { useAppDispatch, useAppSelector } from "../app/store";
import { batch } from "react-redux";
import { setGroupID } from "../feature/groupSlice";

const Home = function () {
	const dispatch = useAppDispatch();
	const statusRef = useRef<HTMLDivElement>(null);

	const [statusMsg, setStatusMsg] = useState("");

	const user = useAppSelector((state) => state.user);
	const group = useAppSelector((state) => state.group);

	const joinGroupOnLoad = async function (
		group: string,
		user: string,
	): Promise<void> {
		dispatch(setIsOwner(false));
		const _u = await joinGroup(group, user);
		if (_u !== undefined) {
			dispatch(setUserID(_u));
		}
	};

	useEffect(() => {
		setStatusMsg("");
		const params = new URLSearchParams(window.location.search);
		const _gid = params.get("group") || "";
		console.log(
			`[-- LOAD DATA --]\nuser.id: ${user.id}\ngroupID: ${_gid}\nisOwner: ${user.isOwner}`,
		);
		if (_gid.length && user.isOwner === false) {
			// Still try to join, even if already joined. To check in case group doesn't exist anymore
			dispatch(setGroupID(_gid));
			joinGroupOnLoad(_gid, user.id);
		} else if (_gid.length) {
			// TODO: Re-create group if expired
			// NOTE: Refreshing owner, is websocket still open?
		}
	}, []);

	const handleButtonHome = function (e: MouseEvent<HTMLButtonElement>): void {
		batch(() => {
			dispatch(setGroupID(""));
			dispatch(setIsOwner(false));
		});
		window.history.replaceState(null, "", "/");
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
						<span className="icon mg-r-4 d-flx flx-items-ctr">
							<HiOutlineUserGroup size="35"></HiOutlineUserGroup>
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

				<PlayerBox isOwner={user.isOwner} groupID={group.id}></PlayerBox>

				<div ref={statusRef} className="status-msg">
					{statusMsg}
				</div>
			</main>
		</>
	);
};

export default Home;

import { useEffect } from "react";
import BtnCreateGroup from "../components/BtnCreateGroup";
import { useAppSelector } from "../app/store";
import JoinGroupDialog from "../components/JoinGroupDialog";
import UserNameDialog from "../components/UserNameDialog";
import NavMain from "../components/NavMain";
import { useDispatch } from "react-redux";
import { setDialogJoinGroup } from "../feature/dialogSlice";
import { setStatusMsg } from "../feature/statusSlice";
import { deleteGroup } from "../feature/groupSlice";
import { setUserIsOwner } from "../feature/userSlice";
import { MdOutlineAddLink } from "react-icons/md";

const Home = function () {
	//
	const dispatch = useDispatch();	
	const groupStore = useAppSelector((state) => state.group);

	useEffect(() => {
		// dispatch(setStatusMsg(""));
		dispatch(deleteGroup(groupStore.id));
		dispatch(setUserIsOwner(false));
		return () => {
			dispatch(setDialogJoinGroup(false));
		};
	}, []);

	return (
		<>
			
			<NavMain />

			<main style={{ textAlign: "center" }}>

				<div className="button-container center d-flx flx-col">
					{!groupStore.id.length && (
						<BtnCreateGroup
							size="large"
						></BtnCreateGroup>
					)}
					<button
						className="btn-small btn-light text-up mg-t-4"
						onClick={() => {
							dispatch(setDialogJoinGroup(true));
						}}	
					>
						<span className="icon mg-r-2 d-flx">
							<MdOutlineAddLink />
						</span>
						<span className="text">Join Group</span></button>
				</div>

				<UserNameDialog maxWidth={250} />
				<JoinGroupDialog maxWidth={350} />
				
			</main>
		</>
	);
};

export default Home;

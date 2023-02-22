import { useEffect } from "react";
import BtnCreateGroup from "../components/BtnCreateGroup";
import { useAppSelector } from "../app/store";
import * as PusherTypes from "pusher-js";
import JoinGroupDialog from "../components/JoinGroupDialog";
import UserNameDialog from "../components/UserNameDialog";
import NavMain from "../components/NavMain";
import { useDispatch } from "react-redux";
import { setDialogJoinGroup } from "../feature/dialogSlice";
import { setStatusMsg } from "../feature/statusSlice";
import { deleteGroup } from "../feature/groupSlice";
import { setUserIsOwner } from "../feature/userSlice";

interface IProps {
	pusher: PusherTypes.default;
}

const Home = function ({ pusher }: IProps) {
	//
	const dispatch = useDispatch();	
	const groupStore = useAppSelector((state) => state.group);

	useEffect(() => {
		dispatch(setStatusMsg(""));
		dispatch(deleteGroup(groupStore.id));
		dispatch(setUserIsOwner(false));
		return () => {
			dispatch(setDialogJoinGroup(false));
			pusher.unbind();
			pusher.unsubscribe(groupStore.id);
			pusher.disconnect();
		};
	}, []);

	return (
		<>
			
			<NavMain pusher={pusher} />

			<main style={{ textAlign: "center" }}>

				<div className="button-container d-flx flx-col">
					{!groupStore.id.length && (
						<BtnCreateGroup
							size="large"
							pusher={pusher}
						></BtnCreateGroup>
					)}
					<button
						className="btn-med btn-light mg-t-3"
						onClick={() => {
							dispatch(setDialogJoinGroup(true));
						}}	
					>Join Group</button>
				</div>

				<UserNameDialog maxWidth={250} />
				<JoinGroupDialog maxWidth={350} />
				
			</main>
		</>
	);
};

export default Home;

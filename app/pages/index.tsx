import { useEffect } from "react";
import Head from "next/head";
import BtnCreateGroup from "../components/BtnCreateGroup";
import JoinGroupDialog from "../components/JoinGroupDialog";
import UserNameDialog from "../components/UserNameDialog";
import NavMain from "../components/NavMain";
import { useDispatch } from "react-redux";
import { setDialogJoinGroup } from "../feature/dialogSlice";
import { MdOutlineAddLink } from "react-icons/md";
import NavigatorDialog from "../components/NavigatorDialog";

const Home = function () {
	//
	const dispatch = useDispatch();	

	useEffect(() => {
		// dispatch(setStatusMsg(""));
		// dispatch(deleteGroup());
		// dispatch(setUserIsOwner(false));
		return () => {
			dispatch(setDialogJoinGroup(false));
		};
	}, []);

	return (
		<>

			<Head>
				<title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
			</Head>
			
			<NavMain />

			<main style={{ textAlign: "center" }}>

				<div className="button-container center d-flx flx-col">
					<BtnCreateGroup
						size="large-2"
					></BtnCreateGroup>
					<button
						className="btn-small btn-light text-up mg-t-4"
						onClick={() => {
							dispatch(setDialogJoinGroup(true));
						}}	
					>
						<span className="icon mg-r-2 d-flx">
							<MdOutlineAddLink size={21} />
						</span>
						<span className="text">Join Group</span></button>
				</div>

				<UserNameDialog maxWidth={250} />
				<JoinGroupDialog maxWidth={350} />
				<NavigatorDialog maxWidth={450} />
				
			</main>
		</>
	);
};

export default Home;

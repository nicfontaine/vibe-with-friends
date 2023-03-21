import { useAppSelector } from "../app/store";
import { VscGlobe } from "react-icons/vsc";
import PuffLoader from "react-spinners/PuffLoader";
import { Group } from "../types/types";

interface IProps {
	isTapPlaying: boolean;
	group: Group | undefined;
}

const UsersGrid = function ({ isTapPlaying, group }: IProps) {

	const user = useAppSelector((state) => state.user);
	// const group = useAppSelector((state) => state.group);
	
	return (
		<>
			<div className="pd-t-8 user-grid">
				{group?.users ? group.users.map((u) => {
					const isPlaying = u.playing ? "active-remote" : "";
					const isUser = u.uid === user.uid ? "user" : "";
					const styleTapPlay = isTapPlaying && u.uid === user.uid ? "active-user" : "";
					return (
						<div
							key={u.uid}
							className={`user-grid-block ${isUser} ${isPlaying} ${styleTapPlay}`}
						>
							<div className="name">{u.name}</div>
							{!isUser &&
								<div className="icon">
									<VscGlobe size={20} />
								</div>
							}
						</div>
					);
				}) : (
					<div className="loading-center">
						<PuffLoader color="#aaaaaa" size={70} className="center loading-spinner" />
					</div>
				)}
			</div>
		</>
	);
};

export default UsersGrid;
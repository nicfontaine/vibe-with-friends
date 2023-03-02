import { useAppSelector } from "../app/store";
import { VscGlobe } from "react-icons/vsc";

interface IProps {
	isTapPlaying: boolean;
}

const UsersGrid = function ({ isTapPlaying }: IProps) {

	const user = useAppSelector((state) => state.user);
	const group = useAppSelector((state) => state.group);
	
	return (
		<>
			<div className="pd-t-8 user-grid">
				{group.users && group.users.map((u) => {
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
				})}
			</div>
		</>
	);
};

export default UsersGrid;
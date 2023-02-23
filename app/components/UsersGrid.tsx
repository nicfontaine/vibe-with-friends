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
				{group.users && Object.keys(group.users).map((u) => {
					const isPlaying = group.users[u].playing ? "playing" : "";
					const isUser = u === user.id ? "user" : "";
					const styleTapPlay = isTapPlaying && u === user.id ? "tap-play-on" : "";
					return (
						<div
							key={u}
							className={`user-grid-block ${isUser} ${isPlaying} ${styleTapPlay}`}
						>
							<div className="name">{group.users[u].name}</div>
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
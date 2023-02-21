import { useAppSelector } from "../app/store";

const UsersGrid = function () {

	const user = useAppSelector((state) => state.user);
	const group = useAppSelector((state) => state.group);
	
	return (
		<>
			<div className="pd-t-8 user-grid">
				{group.users && Object.keys(group.users).map((u) => {
					const isPlaying = group.users[u].playing ? "playing" : "";
					const isUser = u === user.id ? "user" : "";
					return (
						<div
							key={u}
							className={`user-grid-block ${isUser} ${isPlaying}`}
						>
							<div className="name">{group.users[u].name}</div>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default UsersGrid;
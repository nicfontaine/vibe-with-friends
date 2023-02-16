import { useAppDispatch, useAppSelector } from "../app/store";

const UsersGrid = function () {

	const user = useAppSelector((state) => state.user);
	const group = useAppSelector((state) => state.group);
	
	return (
		<>
			<div className="pd-t-8 user-grid">
				{group.users && Object.keys(group.users).map((u) => {
					return (
						<div
							key={u}
							className={`user-grid-block ${u === user.id ? "user" : ""}`}
						>
							<div className="name">{u.split("-")[0]}</div>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default UsersGrid;
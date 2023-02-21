import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../app/store";
import { setUserName } from "../feature/userSlice";
import changeUserName from "../util/change-username";

interface IProps {
	showUserName: boolean;
	setShowUserName: (val: boolean) => void;
}

const UserName = function ({ showUserName, setShowUserName }: IProps) {

	const dispatch = useDispatch();
	const inputRef = useRef<HTMLInputElement>(null);
	const userStore = useAppSelector((state) => state.user);
	const groupStore = useAppSelector((state) => state.group);
	const [name, setName] = useState(userStore.name);

	// Display
	useEffect(() => {
		if (inputRef.current !== null) {
			inputRef.current.focus();
		}
	}, [showUserName]);

	const updateUserName = async function (): Promise<void> {
		const res = await changeUserName(userStore, groupStore);
		if (inputRef.current !== null) {
			inputRef.current.blur();
		}
	};
	
	// Changing name while in a group
	useEffect(() => {
		const n = userStore.name;
		if (n && groupStore.id && n !== groupStore.users[userStore.id].name) {
			updateUserName();
		}
	}, [userStore.name]);

	const handleKeyDown = function (e: KeyboardEvent<HTMLInputElement>): void {
		if (e.key === "Enter") {
			dispatch(setUserName(name));
			setShowUserName(false);
		}
	};

	const handleChange = function (e: ChangeEvent<HTMLInputElement>) {
		setName(e.target.value.toUpperCase());
	};

	return (
		<>
			<div className="user-name-container">
				<div className="background">
					<div className="inner">
						<h3 className="heading mg-t-0 pd-t-0 mg-b-4">Enter a Name</h3>
						<input
							ref={inputRef}
							value={name}
							onChange={handleChange}
							onKeyDown={handleKeyDown}
							autoFocus
						></input>
					</div>
				</div>
			</div>
		</>
	);

};

export default UserName;
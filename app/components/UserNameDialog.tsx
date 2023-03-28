import { ChangeEvent, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../app/store";
import { setUserName } from "../feature/userSlice";
import { RiSendPlane2Fill } from "react-icons/ri";
import { setDialogUserName } from "../feature/dialogSlice";
import { setGroupUsers } from "../feature/groupSlice";
import { useMutation } from "@apollo/client";
import SET_GROUP_USER_NAME from "../apollo/mutations/SetGroupUserName";
import { Group, GroupUser } from "../types/types";

interface IProps {
	maxWidth?: number;
	group?: Group | undefined;
}

const UserNameDialog = function ({ maxWidth, group }: IProps) {

	const dispatch = useDispatch();
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const userStore = useAppSelector((state) => state.user);
	// const groupStore = useAppSelector((state) => state.group);
	const dialogStore = useAppSelector((state) => state.dialog);
	const [name, setName] = useState(userStore.name);
	const [setGroupUserName, { data }] = useMutation(SET_GROUP_USER_NAME);

	if (data) {
		dispatch(setGroupUsers(data.setGroupUserName.group.users));
	}

	// Display
	useEffect(() => {
		if (dialogStore.dialogUserName) {
			containerRef?.current?.classList.add("show");
		}
	}, [dialogStore.dialogUserName]);

	const updateUserName = async function (): Promise<void> {
		setGroupUserName({
			variables: { groupName: group?.name, user: userStore },
		});
		// TODO: Handle error
		if (inputRef.current !== null) {
			inputRef.current.blur();
		}
	};
	
	// Changing name while in a group
	useEffect(() => {
		const n = userStore.name;
		const nameInGroup = group?.users?.filter((u: GroupUser) => u.name === n);
		if (n && group?.name && !nameInGroup) {
			updateUserName();
		}
	}, [userStore.name]);

	const handle = {
		change (e: ChangeEvent<HTMLInputElement>): void {
			setName(e.target.value.toUpperCase());
		},
		submit (): void {
			console.log(name);
			dispatch(setUserName(name));
			dispatch(setDialogUserName(false));
		},
		keyDown (e: KeyboardEvent<HTMLInputElement>): void {
			if (e.key === "Enter") {
				handle.submit();
			} else if (e.key === "Escape") {
				handle.close();
			}
		},
		close () {
			containerRef?.current?.addEventListener("transitionend", function () {
				dispatch(setDialogUserName(false));
			});
			containerRef?.current?.classList.remove("show");
		},
		backdrop (e: MouseEvent<HTMLDivElement>) {
			if ((e.target as Element).getAttribute("data-event-close") === "true") {
				handle.close();
			}
		},
	};

	const innerStyle = {
		maxWidth: maxWidth,
	};

	return (
		<>
			{dialogStore.dialogUserName &&
				<div ref={containerRef} className="input-dialog-container">
					<div
						className="background"
						onClick={handle.backdrop}
						data-event-close="true"
					>
						<div className="inner" style={innerStyle}>
							<h2 className="heading mg-t-0 pd-t-0 mg-b-4">Username</h2>
							<div className="d-flx">
								<input
									className="text-up"
									ref={inputRef}
									value={name}
									onChange={handle.change}
									onKeyDown={handle.keyDown}
									autoFocus
									autoCapitalize="none"
									autoComplete="off"
									autoCorrect="off"
								></input>
								<button
									onClick={handle.submit}
									className="pd-a-1 pd-r-2 pd-l-2 mg-l-2 btn-green"
								>
									<RiSendPlane2Fill size={22} />
								</button>
							</div>
						</div>
					</div>
				</div>
			}
		</>
	);

};

export default UserNameDialog;
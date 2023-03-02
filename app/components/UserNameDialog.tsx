import { ChangeEvent, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../app/store";
import { setUserName } from "../feature/userSlice";
import changeUserName from "../util/change-username";
import { RiSendPlane2Fill } from "react-icons/ri";
import { setDialogUserName } from "../feature/dialogSlice";
import { deleteGroup, setGroupUsers } from "../feature/groupSlice";
import { setStatusMsg } from "../feature/statusSlice";
import { useRouter } from "next/router";

interface IProps {
	maxWidth?: number;
}

const UserNameDialog = function ({ maxWidth }: IProps) {

	const dispatch = useDispatch();
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const userStore = useAppSelector((state) => state.user);
	const groupStore = useAppSelector((state) => state.group);
	const dialogStore = useAppSelector((state) => state.dialog);

	const [name, setName] = useState(userStore.name);

	// Display
	useEffect(() => {
		if (dialogStore.dialogUserName) {
			containerRef?.current?.classList.add("show");
		}
	}, [dialogStore.dialogUserName]);

	const updateUserName = async function (): Promise<void> {
		const res = await changeUserName(userStore, groupStore);
		const { user, group } = res;
		if (res.err) {
			dispatch(deleteGroup(group.id));
			dispatch(setStatusMsg(res.err));
			router.push("/", undefined, { shallow: true });
			return;
		}
		dispatch(setGroupUsers(group.users));
		if (inputRef.current !== null) {
			inputRef.current.blur();
		}
	};
	
	// Changing name while in a group
	useEffect(() => {
		const n = userStore.name;
		const nameInGroup = groupStore.users.filter((u) => u.name === n);
		if (n && groupStore.id && nameInGroup) {
			updateUserName();
		}
	}, [userStore.name]);

	const handle = {
		change (e: ChangeEvent<HTMLInputElement>): void {
			setName(e.target.value.toUpperCase());
		},
		submit (): void {
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
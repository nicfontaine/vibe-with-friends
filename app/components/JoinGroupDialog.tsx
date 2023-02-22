import { ChangeEvent, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { RiSendPlane2Fill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../app/store";
import { setDialogJoinGroup } from "../feature/dialogSlice";

interface IProps {
	maxWidth?: number;
}

const JoinGroupDialog = function ({ maxWidth }: IProps) {

	const router = useRouter();
	const dispatch = useDispatch();
	const dialogStore = useAppSelector((state) => state.dialog);
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [val, setVal] = useState("");

	useEffect(() => {
		if (dialogStore.dialogJoinGroup) {
			containerRef?.current?.classList.add("show");
		}
		inputRef?.current?.focus();
	}, [dialogStore.dialogJoinGroup]);

	const handle = {
		change (e: ChangeEvent<HTMLInputElement>): void {
			setVal(e.target.value.trim());
		},
		submit (): void {
			router.push(`/group/${val}`);
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
				dispatch(setDialogJoinGroup(false));
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
			{ dialogStore.dialogJoinGroup &&
				<div ref={containerRef} className="input-dialog-container">
					<div
						className="background"
						onClick={handle.backdrop}
						data-event-close="true"
					>
						<div className="inner" style={innerStyle}>
							<h2 className="heading mg-t-0 pd-t-0 mg-b-4">Paste Group Name</h2>
							<div className="d-flx">
								<input
									ref={inputRef}
									value={val}
									onChange={handle.change}
									onKeyDown={handle.keyDown}
									autoFocus
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

export default JoinGroupDialog;
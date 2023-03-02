import { KeyboardEvent, MouseEvent, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../app/store";
import { RiSendPlane2Fill } from "react-icons/ri";
import { setDialogNavigator } from "../feature/dialogSlice";
import { MdOutlineSecurityUpdateWarning } from "react-icons/md";

interface IProps {
	maxWidth?: number;
}

const NavigatorDialog = function ({ maxWidth }: IProps) {

	const dispatch = useDispatch();
	const containerRef = useRef<HTMLDivElement>(null);
	const dialogStore = useAppSelector((state) => state.dialog);

	useEffect(() => {
		if (!window?.navigator?.vibrate) {
			dispatch(setDialogNavigator(true));
		} else {
			dispatch(setDialogNavigator(false));
		}
	}, []);

	// Display
	useEffect(() => {
		if (dialogStore.dialogNavigator) {
			containerRef?.current?.classList.add("show");
		}
	}, [dialogStore.dialogNavigator]);

	const handle = {
		keyDown (e: KeyboardEvent<HTMLButtonElement>): void {
			if (e.key === "Escape") {
				handle.close();
			}
		},
		close () {
			containerRef?.current?.addEventListener("transitionend", function () {
				dispatch(setDialogNavigator(false));
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
			{dialogStore.dialogNavigator ? (
				<div ref={containerRef} className="input-dialog-container">
					<div
						className="background"
						onClick={handle.backdrop}
						data-event-close="true"
					>
						<div className="inner" style={innerStyle}>
							<div className="d-flx mg-b-0 just-ctr">
								<span className="icon align-center mg-r-2 d-flx">
									<MdOutlineSecurityUpdateWarning size={26} />
								</span>
								<h2 className="heading mg-t-0 pd-t-0 mg-b-0">Aw, Shucks...</h2>
							</div>
							<p className="mg-t-2">Looks like your device doesn&apos;t support the Vibration API. It will still display visually, but will not vibrate as intended.</p>
							<div className="d-flx just-ctr">
								<button
									onClick={handle.close}
									onKeyDown={handle.keyDown}
									autoFocus
									className="pd-a-1 pd-r-2 pd-l-2 mg-l-2 btn-green"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</>
	);

};

export default NavigatorDialog;
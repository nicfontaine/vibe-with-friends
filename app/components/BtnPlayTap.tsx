import { MouseEvent, TouchEvent, useEffect, useRef, useCallback } from "react";
import { useAppSelector } from "../app/store";
import { MdOutlineSendToMobile } from "react-icons/md";
import { playTapOn, playTapOff } from "../util/play-tap";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { deleteGroup } from "../feature/groupSlice";
import { setStatusMsg } from "../feature/statusSlice";

interface IProps {
	setIsTapPlaying: (value: boolean) => void;
}

const BtnPlayTap = function ({ setIsTapPlaying }: IProps) {

	const btnRef = useRef<HTMLDivElement>(null);
	const dispatch = useDispatch();
	const router = useRouter();

	useEffect(() => {
		// Only works, for mobile, by adding later
		btnRef.current?.addEventListener("touchstart", handleTouchStart, { passive: false });
	}, [btnRef.current]);

	const playOn = async function () {
		btnOn();
		const res = await playTapOn(user, group);
		if (res.err) {
			dispatch(deleteGroup(group.id));
			dispatch(setStatusMsg(res.err));
			router.push("/", undefined, { shallow: true });
			return;
		}
	};

	const playOff = async function () {
		btnOff();
		const res = await playTapOff(user, group);
		if (res.err) {
			dispatch(deleteGroup(group.id));
			dispatch(setStatusMsg(res.err));
			router.push("/", undefined, { shallow: true });
			return;
		}
	};
	
	const user = useAppSelector((state) => state.user);
	const group = useAppSelector((state) => state.group);

	const handleMouseStart = async function (e: MouseEvent<HTMLElement>) {
		playOn();
	};
	const handleMouseEnd = async function (e: MouseEvent<HTMLElement>) {
		playOff();
	};
	const handleTouchStart = async function (e: Event) {
		e.preventDefault();
		playOn();
	};
	const handleTouchEnd = async function () {
		btnOff();
		playOff();
	};
	const handleContextMenu = function (e: MouseEvent<HTMLElement>) {
		e.preventDefault();
	};

	const btnOn = function () {
		setIsTapPlaying(true);
		btnRef.current?.classList.add("active");
	};
	const btnOff = function () {
		setIsTapPlaying(false);
		btnRef.current?.classList.remove("active");
	};
	
	return (
		<>
			{group.id &&
				<div
					ref={btnRef}
					className="btn-tap-play"
					onMouseDown={handleMouseStart}
					onMouseUp={handleMouseEnd}
					onTouchEnd={handleTouchEnd}
					onContextMenu={handleContextMenu}
				>
					<MdOutlineSendToMobile className="noselect icon mg-r-3" size="35"/>
					<span className="text noselect">Vibrate</span>
				</div>
			}
		</>
	);
};

export default BtnPlayTap;
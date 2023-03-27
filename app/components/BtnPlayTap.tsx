import { MouseEvent, useEffect, useRef } from "react";
import { useAppSelector } from "../app/store";
import { MdOutlineSendToMobile } from "react-icons/md";
import PLAY_TAP_OFF from "../apollo/mutations/PlayTapOff";
import PLAY_TAP_ON from "../apollo/mutations/PlayTapOn";
import { useMutation } from "@apollo/client";
import { Group } from "../types/types";

interface IProps {
	setIsTapPlaying: (value: boolean) => void;
	group: Group | undefined;
}

const BtnPlayTap = function ({ setIsTapPlaying, group }: IProps) {

	const btnRef = useRef<HTMLDivElement>(null);
	const user = useAppSelector((state) => state.user);
	// const group = useAppSelector((state) => state.group);
	const [playTapOn] = useMutation(PLAY_TAP_ON);
	const [playTapOff] = useMutation(PLAY_TAP_OFF);

	useEffect(() => {
		// Only works, for mobile, by adding later
		btnRef.current?.addEventListener("touchstart", handleTouchStart, { passive: false });
	}, [btnRef.current]);

	const playOn = async function () {
		btnOn();
		playTapOn({
			variables: { ID: group?.id, user: user },
		});
		// TODO: Handle error
	};

	const playOff = async function () {
		btnOff();
		playTapOff({
			variables: { ID: group?.id, user: user },
		});
	};

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
			{group?.name &&
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
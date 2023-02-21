import { MouseEvent, TouchEvent, useEffect, useRef } from "react";
import { useAppSelector } from "../app/store";
import { MdOutlineSendToMobile } from "react-icons/md";
import { playTapOn, playTapOff } from "../util/play-tap";

const BtnPlayTap = function () {

	const btnRef = useRef<HTMLDivElement>(null);
	const user = useAppSelector((state) => state.user);
	const group = useAppSelector((state) => state.group);

	useEffect(() => {
		if (btnRef.current !== null) {
			btnRef.current?.addEventListener("touchstart", handleTouchStart, { passive: false });
		}
		return () => {
			btnRef.current?.removeEventListener("touchstart", handleTouchStart);
		};
	}, []);

	const handleMouseStart = async function (e: MouseEvent<HTMLElement>) {
		btnRef.current?.classList.add("active");
		// console.log("Mouse start");
		await playTapOn(user, group);
	};
	const handleMouseEnd = async function (e: MouseEvent<HTMLElement>) {
		btnRef.current?.classList.remove("active");
		// console.log("Mouse end");
		await playTapOff(user, group);
	};
	const handleTouchStart = async function (e: Event) {
		e.preventDefault();
		// console.log("Touch start");
		btnRef.current?.classList.add("active");
		await playTapOn(user, group);
	};
	const handleTouchEnd = async function () {
		// console.log("Touch end");
		btnRef.current?.classList.remove("active");
		await playTapOff(user, group);
	};
	const handleContextMenu = function (e: MouseEvent<HTMLElement>) {
		e.preventDefault();
	};
	
	return (
		<>
			{group.id &&
				<div
					ref={btnRef}
					className="btn-tap-play"
					onMouseDown={handleMouseStart}
					onMouseUp={handleMouseEnd}
					// onTouchStart={handleTouchStart}
					onTouchEnd={handleTouchEnd}
					onContextMenu={handleContextMenu}
				>
					<MdOutlineSendToMobile className="icon mg-r-3" size="35"/>
					<span>Vibrate</span>
				</div>
			}
		</>
	);
};

export default BtnPlayTap;
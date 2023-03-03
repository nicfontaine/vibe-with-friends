import { useState } from "react";
import { useRef } from "react";
import sheets from "../util/sheets";
import { useAppSelector } from "../app/store";
import { ISheet } from "../interfaces/types";
import { FaPlayCircle } from "react-icons/fa";
import { playSync } from "../util/play-sync";
import { useDispatch } from "react-redux";
import { deleteGroup } from "../feature/groupSlice";
import { setStatusMsg } from "../feature/statusSlice";
import { useRouter } from "next/router";

const BtnPlaySync = function () {
	//
	const dispatch = useDispatch();
	const router = useRouter();
	const userStore = useAppSelector((state) => state.user);
	const groupStore = useAppSelector((state) => state.group);

	const playerBoxRef = useRef<HTMLButtonElement>(null);
	const [isRunning, setIsRunning] = useState(false);

	const player = async (sheet: ISheet): Promise<void> => {
		if (isRunning) return;
		setIsRunning(true);
		const res = await playSync(groupStore.name, sheet);
		if (res.err) {
			dispatch(deleteGroup(groupStore.name));
			dispatch(setStatusMsg(res.err));
			router.push("/", undefined, { shallow: true });
			return;
		}
		// const { start } = res;
		setIsRunning(false);
	};

	const btnShow = userStore.isOwner && groupStore.name ? "show" : "hide";

	return (
		<button
			ref={playerBoxRef}
			className={`btn-med btn-clear ${btnShow}`}
			onClick={() => player(sheets.jingle)}
		>
			<span className="icon d-flx mg-r-2">
				<FaPlayCircle />
			</span>
			<span className="text">Play Sync</span>
		</button>
	);
};

export default BtnPlaySync;

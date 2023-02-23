import { useState } from "react";
import { useRef } from "react";
import sheets from "../util/sheets";
import { useAppSelector } from "../app/store";
import SyncPlayer from "../util/sync-player";
import { ISheet } from "../interfaces/types";
import { FaPlayCircle } from "react-icons/fa";

const BtnPlaySync = function () {
	//
	const userStore = useAppSelector((state) => state.user);
	const groupStore = useAppSelector((state) => state.group);

	const playerBoxRef = useRef<HTMLButtonElement>(null);
	const [isRunning, setIsRunning] = useState(false);

	const player = async (sheet: ISheet): Promise<void> => {
		// if (isRunning) return;
		// setIsRunning(true);
		fetch("/api/group/play-sync", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				gid: groupStore.id,
				sheet,
			}),
		});
		// await SyncPlayer.play(sheet);
		// if (playerBoxRef.current !== null) {
		// 	playerBoxRef.current.innerHTML = text;
		// }
		// setIsRunning(false);
	};

	const btnShow = userStore.isOwner && groupStore.id ? "show" : "hide";

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

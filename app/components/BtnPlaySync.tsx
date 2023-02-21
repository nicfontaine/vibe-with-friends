import { useState } from "react";
import { useRef } from "react";
import sheets from "../util/sheets";
import { useAppSelector } from "../app/store";
import SyncPlayer from "../util/sync-player";
import { ISheet } from "../interfaces/types";

const BtnPlaySync = function () {
	//
	const userStore = useAppSelector((state) => state.user);
	const groupStore = useAppSelector((state) => state.group);

	const playerBoxRef = useRef<HTMLButtonElement>(null);
	const [isRunning, setIsRunning] = useState(false);

	const player = async (sheet: ISheet): Promise<void> => {
		if (isRunning) return;
		setIsRunning(true);
		const text = playerBoxRef.current?.innerHTML || "";
		//
		fetch("/api/group/play-sync", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				gid: groupStore.id,
				sheet,
			}),
		});
		await SyncPlayer.play(sheet);
		if (playerBoxRef.current !== null) {
			playerBoxRef.current.innerHTML = text;
		}
		setIsRunning(false);
	};

	return (
		<button
			ref={playerBoxRef}
			className={`player-box btn-med btn-border mg-r-4
			${userStore.isOwner && groupStore.id ? "show" : ""}`}
			onClick={() => player(sheets.jingle)}
		>
			<span>Play Sync</span>
		</button>
	);
};

export default BtnPlaySync;

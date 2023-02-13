import { useState } from "react";
import { useRef } from "react";
import sheets from "../util/sheets";

interface IPlayerBoxProps {
	isOwner: boolean;
	groupID: string;
}
interface ISheet {
	bpm: number;
	song: Array<number>;
}

const PlayerBox = function ({ isOwner, groupID }: IPlayerBoxProps) {
	//
	const playerBoxRef = useRef<HTMLButtonElement>(null);
	const [isRunning, setIsRunning] = useState(false);

	const player = async (sheet: ISheet): Promise<void> => {
		if (isRunning) return;
		setIsRunning(true);
		const mult = 120 / sheet.bpm;
		const timer = function (ms: number) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		};
		const on = "#3BA067";
		const off = "rgba(255,255,255,0.2)";
		let i = 0;
		const innerSave = playerBoxRef.current?.innerHTML || "";
		for (const dur of sheet.song) {
			const active = i % 2 === 0;
			if (active) {
				navigator.vibrate(dur * mult);
				if (playerBoxRef.current !== null) {
					playerBoxRef.current.style.background = on;
					playerBoxRef.current.innerHTML = `<span>${dur * mult} ms</span>`;
				}
			} else {
				navigator.vibrate(0);
				if (playerBoxRef.current !== null) {
					playerBoxRef.current.style.background = off;
					playerBoxRef.current.innerHTML = `<span>Playing...</span>`;
				}
			}
			i++;
			await timer(dur * mult);
		}

		if (playerBoxRef.current !== null) {
			playerBoxRef.current.style.background = off;
			playerBoxRef.current.innerHTML = innerSave;
		}
		setIsRunning(false);
	};

	return (
		<button
			ref={playerBoxRef}
			className={`player-box btn-med btn-border mg-r-4
			${isOwner && groupID ? "show" : ""}`}
			onClick={() => player(sheets.jingle)}
		>
			<span>Play Sync</span>
		</button>
	);
};

export default PlayerBox;

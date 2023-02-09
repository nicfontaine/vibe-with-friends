import { useState } from 'react';
import { useRef } from 'react';
import sheets from '../util/sheets';

interface PlayerBoxProps {
	isOwner: boolean;
	groupID: string;
}
interface Sheet {
	bpm: number;
	song: Array<number>;
}

const PlayerBox = function ({ isOwner, groupID }: PlayerBoxProps) {
	const playerBoxRef = useRef<HTMLDivElement>(null);
	const [isRunning, setIsRunning] = useState(false);

	const player = async (sheet: Sheet) => {
		if (isRunning) return;
		setIsRunning(true);
		const mult: number = 120 / sheet.bpm;
		const timer = function (ms: number) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		};
		const on = '#3BA067';
		const off = 'rgba(255,255,255,0.2)';
		let i = 0;
		const innerSave = playerBoxRef.current?.innerHTML || '';
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
					playerBoxRef.current.innerHTML = `<span></span>`;
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
		<div
			ref={playerBoxRef}
			className={`player-box
			${isOwner && groupID ? 'show' : ''}`}
			onClick={() => player(sheets.jingle)}
		>
			<span>Run</span>
		</div>
	);
};

export default PlayerBox;

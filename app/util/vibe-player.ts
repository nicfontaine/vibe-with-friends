import { ISheet } from "../types/types";

class VibePlayer {

	static async play (sheet: ISheet) {
		VibePlayer.off();
		const multiplier = 120 / sheet.bpm;
		const timer = function (ms: number) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		};
		let i = 0;
		for (const dur of sheet.song) {
			const t = dur * multiplier;
			const active = i % 2 === 0;
			active ? VibePlayer.on(t) : VibePlayer.off();
			i++;
			await timer(t);
		}
		document.documentElement.classList.remove("play-sync-on");
	}

	static on (t: number) {
		window?.navigator?.vibrate?.(t);
		document.documentElement.classList.add("play-sync-on");
	}

	static off () {
		window?.navigator?.vibrate?.(0);
		document.documentElement.classList.remove("play-sync-on");
	}

}

export default VibePlayer;
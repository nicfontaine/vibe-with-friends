import { Html } from "next/document";
import { ISheet } from "../interfaces/types";

class SyncPlayer {

	// target?: HTMLButtonElement;
	sheet: ISheet;
	multiplier: number;

	constructor (sheet: ISheet) {
		this.sheet = sheet;
		this.multiplier = 120 / sheet.bpm;
	}

	async play () {
		const timer = function (ms: number) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		};
		let i = 0;
		for (const dur of this.sheet.song) {
			const t = dur * this.multiplier;
			const active = i % 2 === 0;
			active ? this.#on(t) : this.#off();
			i++;
			await timer(t);
		}
		document.documentElement.classList.remove("play-sync-on");
	}

	#on (t: number) {
		// console.log("on");
		navigator.vibrate(t);
		document.documentElement.classList.add("play-sync-on");
	}

	#off () {
		// console.log("off");
		navigator.vibrate(0);
		document.documentElement.classList.remove("play-sync-on");
	}

}

export default SyncPlayer;
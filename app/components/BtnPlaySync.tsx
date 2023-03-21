import { useState } from "react";
import { useRef } from "react";
import sheets from "../util/sheets";
import { useAppSelector } from "../app/store";
import { Group, Sheet } from "../types/types";
import { FaPlayCircle } from "react-icons/fa";
import { PulseLoader } from "react-spinners";
import { useMutation } from "@apollo/client";
import PLAY_SYNC from "../apollo/mutations/PlaySync";

interface IProps {
	group: Group | undefined;
}

const BtnPlaySync = function ({ group }: IProps) {
	//
	const userStore = useAppSelector((state) => state.user);
	// const groupStore = useAppSelector((state) => state.group);
	const statusStore = useAppSelector((state) => state.status);
	const [playSync] = useMutation(PLAY_SYNC);

	const playerBoxRef = useRef<HTMLButtonElement>(null);
	const [isRunning, setIsRunning] = useState(false);

	const player = async (sheet: Sheet): Promise<void> => {
		if (isRunning) return;
		if (group) {
			setIsRunning(true);
			playSync({ variables: { ID: group.id, sheet } });
			// TODO: Handle error
			setIsRunning(false);
		}
	};

	const btnShow = userStore.isOwner && group?.name ? "show" : "hide";

	return (
		<>
			<button
				ref={playerBoxRef}
				className={`btn-med btn-clear ${btnShow}`}
				onClick={() => player(sheets.jingle)}
			>
				<span className="icon d-flx mg-r-2">
					<FaPlayCircle />
				</span>
				<span className="text">Play Sync</span>
				<div className="btn-play-sync-loading">
					<PulseLoader
						size={7}
						loading={statusStore.playSyncLoading}
						color={"#fff"}
					></PulseLoader>
				</div>
			</button>
		</>
	);
};

export default BtnPlaySync;

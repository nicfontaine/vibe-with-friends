import { useEffect } from "react";

interface IProps {
	statusMsg: string;
	setStatusMsg: (val: string) => void;
}

const StatusMsg = function ({ statusMsg, setStatusMsg }: IProps) {
	useEffect(() => {
		setTimeout(() => {
			setStatusMsg("");
		}, 4000);
	}, [statusMsg]);

	return (
		<div className={`status-msg ${statusMsg ? "show" : ""}`}>{statusMsg}</div>
	);
};

export default StatusMsg;

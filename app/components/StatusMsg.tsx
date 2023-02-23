import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../app/store";
import { setStatusMsg } from "../feature/statusSlice";

const StatusMsg = function () {
	
	const dispatch = useDispatch();
	const statusStore = useAppSelector((state) => state.status);
	
	useEffect(() => {
		if (statusStore.text) {
			setTimeout(() => {
				dispatch(setStatusMsg(""));
			}, 4000);
		}
	}, [statusStore.text]);

	return (
		<div className={`status-msg ${statusStore.text ? "show" : ""}`}>{statusStore.text}</div>
	);
};

export default StatusMsg;

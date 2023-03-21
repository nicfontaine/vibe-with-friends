import { useEffect, useState } from "react";
import { Group } from "../types/types";
import { setStatusMsg } from "../feature/statusSlice";
import copyToClipboard from "../util/copy-to-clipboard";
import { useDispatch } from "react-redux";
import { HiOutlineUserGroup } from "react-icons/hi";

interface IProps {
	group: Group
}

const NavGroupCode = function ({ group }: IProps) {

	const dispatch = useDispatch();
	const [groupDisplayString, setGroupDisplayString] = useState("");

	useEffect(() => {
		if (!group?.name.length) return;
		let i = 1;
		const t = setInterval(() => {
			if (i >= group.name.length) clearInterval(t);
			setGroupDisplayString(group.name.substring(0, i));
			i++;
		}, 20);
	}, [group?.name]);

	const handleGroupCopy = function (): void {
		if (group?.name) {
			copyToClipboard(group.name);
		}
		dispatch(setStatusMsg("Copied Group Name"));
	};

	return (
		<>
			<div className="nav-group-code">
				<span className="icon mg-r-2 d-flx flx-items-ctr">
					<HiOutlineUserGroup size="20"></HiOutlineUserGroup>
				</span>
				<div
					className="group"
					onClick={handleGroupCopy}
				>{groupDisplayString}</div>
			</div>
		</>
	);

};

export default NavGroupCode;
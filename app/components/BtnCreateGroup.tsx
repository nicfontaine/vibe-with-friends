import { MouseEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/store";
import { setUser } from "../feature/userSlice";
import { useRouter } from "next/router";
import { setStatusMsg } from "../feature/statusSlice";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { useMutation } from "@apollo/client";
import CREATE_GROUP from "../apollo/mutations/CreateGroup";
import urlShare from "../util/url-share";
import { Group, User } from "../types/types";

interface IProps {
	size?: string;
	text?: string;
}

const BtnCreateGroup = function ({ size, text }: IProps) {
	//
	const dispatch = useAppDispatch();
	const router = useRouter();
	const user = useAppSelector((state) => state.user);

	const [createGroup, { data, loading, error }] = useMutation(CREATE_GROUP);
	
	const groupCreateResponse = async function (group: Group, user: User) {
		dispatch(setUser(user));
		const url = `${window.location.origin}/group/${group.name}`;
		await urlShare(url);
		router.push({ pathname: "/group/[gid]", query: { gid: group.name } });
	};

	useEffect(() => {
		if (data) {
			groupCreateResponse(data.createGroup.group, data.createGroup.user);
		}
	}, [data]);

	if (loading) {
		// TODO: Loading icon
		console.log("Loading...");
	}
	if (error) {
		console.log(error.message);
		dispatch(setStatusMsg(error.message));
	}

	const handleCreateGroup = async function (e: MouseEvent<HTMLButtonElement>) {
		(e.target as HTMLButtonElement)?.blur();
		createGroup({
			variables: { user },
		});
	};

	return (
		<button
			onClick={handleCreateGroup}
			className={`btn-main btn-${size || "med"} btn-clear`}
		>
			<span className="icon mg-r-2 d-flx">
				<AiOutlineAppstoreAdd />
			</span>
			<span className="text">{text || "Create Group"}</span>
		</button>
	);
};

export default BtnCreateGroup;

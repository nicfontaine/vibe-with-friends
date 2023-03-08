import { MouseEvent } from "react";
import { useAppDispatch, useAppSelector } from "../app/store";
import { setUser } from "../feature/userSlice";
import { setGroup } from "../feature/groupSlice";
import { batch } from "react-redux";
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
	const userStore = useAppSelector((state) => state.user);

	const [createGroup, { data, loading, error }] = useMutation(CREATE_GROUP);
	
	const groupCreateResponse = async function (group: Group, user: User) {
		console.log("createGroup (GQL)");
		batch(() => {
			dispatch(setGroup(group));
			dispatch(setUser(user));
		});
		const url = `${window.location.origin}/group/${group.name}`;
		await urlShare(url);
		router.push({ pathname: "/group/[gid]", query: { gid: group.name } });
	};

	if (loading) {
		// TODO: Loading icon
		console.log("Loading...");
	}
	if (error) {
		dispatch(setStatusMsg(error.message));
	}
	if (data) {
		groupCreateResponse(data.createGroup.group, data.createGroup.user);
	}

	const handleCreateGroup = async function (e: MouseEvent<HTMLButtonElement>) {
		(e.target as HTMLButtonElement)?.blur();
		createGroup({
			variables: {
				user: userStore,
			},
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

import { MouseEvent } from "react";
import createGroup from "../util/create-group";
import { useAppDispatch, useAppSelector } from "../app/store";
import { setUser } from "../feature/userSlice";
import { setGroup } from "../feature/groupSlice";
import { batch } from "react-redux";
import { useRouter } from "next/router";
import { setStatusMsg } from "../feature/statusSlice";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { useMutation } from "@apollo/client";
import CREATE_GROUP from "../apollo/mutations/CreateGroup";

interface IProps {
	size?: string;
	text?: string;
}

const BtnCreateGroup = function ({ size, text }: IProps) {
	//
	const dispatch = useAppDispatch();
	const router = useRouter();
	const userStore = useAppSelector((state) => state.user);

	const [gqlCreateGroup, { data, loading, error }] = useMutation(CREATE_GROUP);
	if (loading) console.log("loading...");
	if (error) console.log(`ERROR: ${error.message}`);
	if (data) console.log(data);

	const handleCreateGroup = async function (e: MouseEvent<HTMLButtonElement>) {
		(e.target as HTMLButtonElement)?.blur();
		const res = await createGroup(userStore);
		// gqlCreateGroup({
		// 	variables: {
		// 		user: userStore,
		// 	},
		// });
		const { user, group } = res;
		batch(() => {
			dispatch(setUser(user));
			dispatch(setGroup(group));
		});
		if (res.msg) dispatch(setStatusMsg(res.msg));
		router.push({ pathname: "/group/[gid]", query: { gid: group.name } });
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

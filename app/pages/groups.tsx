import { useQuery } from "@apollo/client";
import ALL_GROUPS from "../apollo/queries/AllGroups";
import { Group } from "../types/types";

const Groups = function () {

	const { loading, error, data } = useQuery(ALL_GROUPS);
	if (loading) return "Loading...";
	if (error) return `ERROR: ${error.message}`;

	return (
		<>
			{data.allGroups.map((g: Group) => (
				<div key={g.name}>{g.name}</div>
			))}
		</>
	);

};

export default Groups;
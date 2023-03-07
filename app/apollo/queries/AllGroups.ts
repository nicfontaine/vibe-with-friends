import { gql } from "@apollo/client";

const ALL_GROUPS = gql`
	query Query {
		allGroups {
			id
			name
			ownerID
			lastEvent
			users {
				id
				uid
				name
				isOwner
			}
		}
	}
`;

export default ALL_GROUPS;
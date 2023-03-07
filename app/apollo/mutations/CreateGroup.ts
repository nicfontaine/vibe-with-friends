import { gql } from "@apollo/client";

const CREATE_GROUP = gql`
	mutation Mutation($user: GroupOwnerInput!) {
		createGroup(user: $user) {
			id
			name
			ownerID
			lastEvent
			users {
				uid
				name
				isOwner
			}
		}
	}
`;

export default CREATE_GROUP;
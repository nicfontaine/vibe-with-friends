import { gql } from "@apollo/client";

const ADD_GROUP_USER = gql`
	mutation Mutation($groupName: String!, $user: GroupUserInput!) {
		addGroupUser(groupName: $groupName, user: $user) {
			user {
				uid
				name
				isOwner
			}
			group {
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
	}
`;

export default ADD_GROUP_USER;
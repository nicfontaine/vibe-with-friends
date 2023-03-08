import { gql } from "@apollo/client";

const SET_GROUP_USER_NAME = gql`
	mutation Mutation($ID: String!, $user: GroupUserInput!) {
		setGroupUserName(ID: $ID, user: $user) {
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

export default SET_GROUP_USER_NAME;
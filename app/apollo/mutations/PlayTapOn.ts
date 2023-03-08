import { gql } from "@apollo/client";

const PLAY_TAP_ON = gql`
	mutation Mutation($ID: String!, $user: GroupUserInput!) {
		playTapOn(ID: $ID, user: $user) {
			id
			name
		}
	}
`;

export default PLAY_TAP_ON;
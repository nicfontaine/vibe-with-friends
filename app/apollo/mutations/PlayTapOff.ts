import { gql } from "@apollo/client";

const PLAY_TAP_OFF = gql`
	mutation Mutation($ID: String!, $user: GroupUserInput!) {
		playTapOff(ID: $ID, user: $user) {
			id
			name
		}
	}
`;

export default PLAY_TAP_OFF;
import { gql } from "@apollo/client";

const PLAY_SYNC = gql`
	mutation Mutation($ID: String!, $sheet: SheetInput!) {
		playSync(ID: $ID, sheet: $sheet) {
			id
			name
		}
	}
`;

export default PLAY_SYNC;
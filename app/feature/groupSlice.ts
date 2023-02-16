import { createSlice } from "@reduxjs/toolkit";

interface IUser {
	[key: string]: {
		name: string;
	}
}
interface IState {
	id: string;
	ownerID: string;
	users: IUser;
}

const initialState: IState = {
	id: "",
	ownerID: "",
	users: {},
};

export const groupSlice = createSlice({
	name: "group",
	initialState,
	reducers: {
		setGroupID: (state, action) => {
			state.id = action.payload;
		},
		deleteGroup: (state, action) => {
			state.id = initialState.id;
			state.ownerID = initialState.ownerID;
			state.users = initialState.users;
		},
		setGroupOwner: (state, action) => {
			state.ownerID = action.payload;
		},
		addGroupUser: (state, action) => {
			state.users[action.payload.userID] = {
				name: action.payload.userName,
			};
		},
		setGroupUsers: (state, action) => {
			state.users = action.payload;
		},
	},
});

export const { setGroupID, deleteGroup, setGroupOwner, addGroupUser, setGroupUsers } = groupSlice.actions;

export default groupSlice.reducer;

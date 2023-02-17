import { createSlice } from "@reduxjs/toolkit";
import { IGroup } from "../interfaces/types";

const initialState: IGroup = {
	id: "",
	ownerID: "",
	users: {},
};

export const groupSlice = createSlice({
	name: "group",
	initialState,
	reducers: {
		setGroup: (state, action) => {
			state.id = action.payload.id;
			state.ownerID = action.payload.ownerID;
			state.users = action.payload.users;
		},
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

export const { setGroup, setGroupID, deleteGroup, setGroupOwner, addGroupUser, setGroupUsers } = groupSlice.actions;

export default groupSlice.reducer;

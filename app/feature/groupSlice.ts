import { createSlice } from "@reduxjs/toolkit";
import { Group } from "../types/types";

const initialState: Group = {
	name: "",
	ownerID: "",
	users: [],
};

export const groupSlice = createSlice({
	name: "group",
	initialState,
	reducers: {
		setGroup: (state, action) => {
			state.name = action.payload.name;
			state.ownerID = action.payload.ownerID;
			state.users = action.payload.users;
		},
		setGroupID: (state, action) => {
			state.name = action.payload;
		},
		deleteGroup: (state) => {
			state.name = initialState.name;
			state.ownerID = initialState.ownerID;
			state.users = initialState.users;
		},
		setGroupOwner: (state, action) => {
			state.ownerID = action.payload;
		},
		setGroupUsers: (state, action) => {
			state.users = action.payload;
		},
		setGroupUserPlaying: (state, action) => {
			const user = state.users.find((u) => u.uid === action.payload.uid);
			if (user) user.playing = action.payload.val;
		},
	},
});

export const { setGroup, setGroupID, deleteGroup, setGroupOwner, setGroupUsers, setGroupUserPlaying } = groupSlice.actions;

export default groupSlice.reducer;

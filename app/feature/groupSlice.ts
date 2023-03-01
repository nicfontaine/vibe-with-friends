import { createSlice } from "@reduxjs/toolkit";
import { IGroup, IGroupUser } from "../interfaces/types";

const initialState: IGroup = {
	id: "",
	ownerID: "",
	users: [],
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

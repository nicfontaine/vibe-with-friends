import { createSlice } from "@reduxjs/toolkit";
import { PlayTapGroup, PlayTapUser } from "../types/types";

const initialState: PlayTapGroup = {
	id: "",
	users: [],
};

export const playTapSlice = createSlice({
	name: "playTap",
	initialState,
	reducers: {
		setPlayGroup: (state, action) => {
			state.id = action.payload.id;
			state.users = action.payload.users;
		},
		setGroupUserPlaying: (state, action) => {
			const user = state.users.find((u: PlayTapUser) => u.uid === action.payload.uid);
			if (user) user.playing = action.payload.val;
		},
	},
});

export const {
	setPlayGroup,
	setGroupUserPlaying,
} = playTapSlice.actions;

export default playTapSlice.reducer;

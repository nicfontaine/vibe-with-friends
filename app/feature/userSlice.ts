import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../interfaces/types";

const initialState: IUser = {
	id: "",
	name: "",
	isOwner: false,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.id = action.payload.id;
			state.isOwner = action.payload.isOwner;
			state.name = action.payload.name;
		},
		setUserID: (state, action) => {
			state.id = action.payload;
		},
		setUserName: (state, action) => {
			state.name = action.payload;
		},
		setUserIsOwner: (state, action) => {
			state.isOwner = action.payload;
		},
	},
});

export const { setUser, setUserID, setUserName, setUserIsOwner } = userSlice.actions;

export default userSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IState {
	id: string;
	isOwner: boolean;
}

const initialState: IState = {
	id: "",
	isOwner: false,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUserID: (state, action) => {
			state.id = action.payload;
		},
		setIsOwner: (state, action) => {
			state.isOwner = action.payload;
		},
	},
});

export const { setUserID, setIsOwner } = userSlice.actions;

export default userSlice.reducer;

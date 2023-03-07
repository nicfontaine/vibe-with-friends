import { createSlice } from "@reduxjs/toolkit";

interface IStatus {
	text: string;
	playSyncLoading: boolean;
}
const initialState: IStatus = {
	text: "",
	playSyncLoading: false,
};

export const statusSlice = createSlice({
	name: "status",
	initialState,
	reducers: {
		setStatusMsg: (state, action) => {
			state.text = action.payload;
		},
		setPlaySyncLoading: (state, action) => {
			state.playSyncLoading = action.payload;
		},
	},
});

export const {
	setStatusMsg,
	setPlaySyncLoading,
} = statusSlice.actions;

export default statusSlice.reducer;

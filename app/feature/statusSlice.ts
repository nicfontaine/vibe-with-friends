import { createSlice } from "@reduxjs/toolkit";

interface IStatus {
	text: string;
}
const initialState: IStatus = {
	text: "",
};

export const statusSlice = createSlice({
	name: "status",
	initialState,
	reducers: {
		setStatusMsg: (state, action) => {
			state.text = action.payload;
		},
	},
});

export const {
	setStatusMsg,
} = statusSlice.actions;

export default statusSlice.reducer;

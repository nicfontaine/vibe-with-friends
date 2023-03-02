import { createSlice } from "@reduxjs/toolkit";

interface IDialog {
	dialogUserName: boolean;
	dialogJoinGroup: boolean;
	dialogNavigator: boolean;
}
const initialState: IDialog = {
	dialogUserName: false,
	dialogJoinGroup: false,
	dialogNavigator: false,
};

export const dialogSlice = createSlice({
	name: "dialog",
	initialState,
	reducers: {
		setDialogUserName: (state, action) => {
			state.dialogUserName = action.payload;
		},
		setDialogJoinGroup: (state, action) => {
			state.dialogJoinGroup = action.payload;
		},
		setDialogNavigator: (state, action) => {
			state.dialogNavigator = action.payload;
		},
	},
});

export const {
	setDialogUserName,
	setDialogJoinGroup,
	setDialogNavigator,
} = dialogSlice.actions;

export default dialogSlice.reducer;

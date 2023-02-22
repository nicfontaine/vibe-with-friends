import { createSlice } from "@reduxjs/toolkit";

interface IDialog {
	dialogUserName: boolean;
	dialogJoinGroup: boolean;
}
const initialState: IDialog = {
	dialogUserName: false,
	dialogJoinGroup: false,
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
	},
});

export const {
	setDialogUserName,
	setDialogJoinGroup,
} = dialogSlice.actions;

export default dialogSlice.reducer;

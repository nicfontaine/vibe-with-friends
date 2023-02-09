import { createSlice } from "@reduxjs/toolkit";

interface IState {
	id: string;
	users: string[];
}

const initialState: IState = {
	id: "",
	users: [],
};

export const groupSlice = createSlice({
	name: "group",
	initialState,
	reducers: {
		setGroupID: (state, action) => {
			state.id = action.payload;
		},
	},
});

export const { setGroupID } = groupSlice.actions;

export default groupSlice.reducer;

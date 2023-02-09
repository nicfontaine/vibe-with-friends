import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
	persistReducer,
	persistStore,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "../feature/userSlice";
import groupSlice from "../feature/groupSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const reducers = combineReducers({
	user: userSlice,
	group: groupSlice,
});

const persistConfig = {
	key: "root",
	version: 1,
	storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

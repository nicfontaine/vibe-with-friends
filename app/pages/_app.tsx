// import styles from "../styles/Home.module.css";
import "../styles/bonkr.css";
import "../styles/globals.css";
import { store } from "../app/store";
import type { AppProps } from "next/app";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

const persistor = persistStore(store);

const MyApp = function ({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Component {...pageProps} />
			</PersistGate>
		</Provider>
	);
};

export default MyApp;

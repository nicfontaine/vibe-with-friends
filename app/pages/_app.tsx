// import styles from "../styles/Home.module.css";
import "../styles/bonkr.css";
import "../styles/globals.css";
import { store } from "../app/store";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
const client = new ApolloClient({
	uri: "/graphql",
	cache: new InMemoryCache(),
});

const persistor = persistStore(store);

const MyApp = function ({ Component, pageProps }: AppProps) {
	return (
		<ApolloProvider client={client}>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<Component {...pageProps} />
				</PersistGate>
			</Provider>
		</ApolloProvider>
	);
};

export default MyApp;

import '../styles/globals.css';
import '../styles/bonkr.css';
import type { AppProps } from 'next/app';

const MyApp = function ({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
};

export default MyApp;

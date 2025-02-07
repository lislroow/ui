import { AppProps } from 'next/app';
import Head from 'next/head';
import '@/css/globals.css';

const AppStructer = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div>
        <Component {...pageProps} />
      </div>
    </>
  );
};

export default AppStructer;

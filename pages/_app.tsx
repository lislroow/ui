import { AppProps } from 'next/app';
import '@/css/globals.css';

const AppStructer = ({ Component, pageProps }: AppProps) => {
  return (
    <div>
      <Component {...pageProps} />
    </div>
  );
};

export default AppStructer;

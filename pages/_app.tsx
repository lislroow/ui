import { AppProps } from 'next/app';
import '@/css/globals.css';


const AppStructer = ({ Component, pageProps }: AppProps) => {
  return (
    <div className='layout'>
      <header>
        header
      </header>
      <aside>
        aside
      </aside>
      <main>
        main
      </main>
      <footer>
        footer
      </footer>
    </div>
  );
};

export default AppStructer;

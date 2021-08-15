import { useState } from 'react';
import Link from 'next/link';
import Icon from '../components/Icon';
import { UserProvider, userState } from '../components/userContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { ToastProvider } from 'react-toast-notifications';

import '../styles/globals.css';
import './app.css';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useLocalStorage('inLightMeditationUser', userState);

  return (
    <UserProvider value={{ user, setUser }}>
      <ToastProvider>
        <div className="app__container">
          <nav className="navigation border-b p-6">
            <div className="flex mt-4 justify-evenly items-center">
              <Link href="/">
                <a className="mr-4 text-green-400 text-sm">
                  <Icon name={'store'} className={'green-400'} />
                </a>
              </Link>
              <Link href="/create-meditation">
                <a className="mr-4 text-green-400 text-sm">
                  <Icon name={'meditate'} className={'green-400'} />
                </a>
              </Link>
              <Link href="/my-meditations">
                <a className="mr-4 text-green-400 text-sm">
                  <Icon name={'list'} className={'green-400'} />
                </a>
              </Link>
              <Link href="/meditations-dashboard">
                <a className="mr-4 text-green-400 text-sm">
                  <Icon name={'user'} className={'green-400'} />
                </a>
              </Link>
            </div>
          </nav>
          <Component {...pageProps} />
        </div>
      </ToastProvider>
    </UserProvider>
  );
}

export default MyApp;

import { useState } from 'react';
import Link from 'next/link';
import Icon from '../components/Icon';
import { UserProvider, userState } from '../components/userContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { ToastProvider } from 'react-toast-notifications';

import '../styles/globals.css';
import './app.css';

function MyApp({ Component, pageProps, router }) {
  const [user, setUser] = useLocalStorage('inLightMeditationUser', userState);

  console.log(router.pathname);
  return (
    <UserProvider value={{ user, setUser }}>
      <ToastProvider>
        <div className="app__container">
          <nav className="navigation border-b p-4">
            <div className="flex justify-evenly items-center">
              <Link href="/">
                <a
                  className={`mr-4 text-green-400 text-sm navigation__link ${
                    router.pathname === '/' ? 'navigation__link--active' : ''
                  }`}
                >
                  <Icon name={'store'} className={'green-400'} />
                </a>
              </Link>
              <Link href="/create-meditation">
                <a
                  className={`mr-4 text-green-400 text-sm navigation__link ${
                    router.pathname === '/create-meditation'
                      ? 'navigation__link--active'
                      : ''
                  }`}
                >
                  <Icon name={'meditate'} className={'green-400'} />
                </a>
              </Link>
              <Link href="/list">
                <a
                  className={`mr-4 text-green-400 text-sm navigation__link ${
                    router.pathname === '/list'
                      ? 'navigation__link--active'
                      : ''
                  }`}
                >
                  <Icon name={'list'} className={'green-400'} />
                </a>
              </Link>
              <Link href="/profile">
                <a
                  className={`mr-4 text-green-400 text-sm navigation__link ${
                    router.pathname === '/profile'
                      ? 'navigation__link--active'
                      : ''
                  }`}
                >
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

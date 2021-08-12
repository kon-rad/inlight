import '../styles/globals.css';
import Link from 'next/link';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">InLight Meditation Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500">Home</a>
          </Link>
          <Link href="/create-meditation">
            <a className="mr-6 text-pink-500">Meditation</a>
          </Link>
          <Link href="/my-meditations">
            <a className="mr-6 text-pink-500">My Meditations</a>
          </Link>
          <Link href="/meditations-dashboard">
            <a className="mr-6 text-pink-500">Meditations Dashboard</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

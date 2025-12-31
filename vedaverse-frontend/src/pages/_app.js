import Head from 'next/head';
// Purani global styles
import '../styles/globals.css';
// Tumhari nayi Cinematic GTA style (Isko niche rakha hai taki ye priority le)
import '../styles/gta-style.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Mobile responsiveness aur scaling fix */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <title>VedaVerse | Interactive Singularity</title>
        
        {/* Favicon aur Fonts (Optional but good for look) */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Pura app yahan render hoga */}
      <Component {...pageProps} />

      <style jsx global>{`
        /* Global Reset taki scroll smooth rahe */
        html, body {
          padding: 0;
          margin: 0;
          background: #000;
          color: #fff;
          overflow-x: hidden;
        }
        
        * {
          box-sizing: border-box;
        }

        /* Custom scrollbar taki website pro lage */
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: #000;
        }
        ::-webkit-scrollbar-thumb {
          background: #ffcc00;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}

export default MyApp;
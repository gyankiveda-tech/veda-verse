import Head from 'next/head';
// Purani global styles
import '../styles/globals.css';
// Tumhari nayi Cinematic GTA style
import '../styles/gta-style.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Mobile responsiveness fix: Fit to cover logic */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover" />
        <title>VedaVerse | Interactive Singularity</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Root Wrapper */}
      <div className="vedaverse-root">
        <Component {...pageProps} />
      </div>

      <style jsx global>{`
        /* Global Reset */
        html, body {
          padding: 0;
          margin: 0;
          background: #000;
          color: #fff;
          width: 100%;
          min-height: 100%;
          overflow-x: hidden; /* Horizontal scroll block */
          overflow-y: auto;   /* Vertical scroll allow */
        }
        
        * {
          box-sizing: border-box;
        }

        /* 🔄 VERTICAL LOCK LOGIC FOR MOBILE 🔄 */
        @media only screen and (max-width: 900px) {
          .vedaverse-root {
            width: 100vw;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
            position: relative;
          }

          /* Agar user landscape kare, toh hum usey portrait feel denge */
          @media (orientation: landscape) {
            .vedaverse-root {
              /* No rotation needed now, just ensuring it stays vertical flow */
              transform: none;
              width: 100vw;
              height: auto;
            }
          }
        }

        /* Desktop Settings - No Changes */
        @media only screen and (min-width: 901px) {
          .vedaverse-root {
            width: 100%;
            height: auto;
          }
        }

        /* Professional Scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: #050505;
        }
        ::-webkit-scrollbar-thumb {
          background: #ffcc00;
          border-radius: 20px;
        }
      `}</style>
    </>
  );
}

export default MyApp;

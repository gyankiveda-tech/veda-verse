import Head from 'next/head';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// --- DYNAMIC IMPORTS ---
const Navbar = dynamic(() => import('../components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });
const CinematicHero = dynamic(() => import('../components/CinematicHero'), { ssr: false });
const AudioEngine = dynamic(() => import('../components/AudioEngine'), { ssr: false });
const Scene3D = dynamic(() => import('../components/Scene3D'), { ssr: false });
const GTASection = dynamic(() => import('../components/GTASection'), { ssr: false });

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollPos, setScrollPos] = useState(0);
  
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [activeLog, setActiveLog] = useState({ title: '', content: '' });

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollPos(window.scrollY);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const unsubscribe = onAuthStateChanged(auth, (u) => { 
      setUser(u); 
      setLoading(false); 
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleReadLog = (title, content) => {
    setActiveLog({ title, content });
    setIsLogOpen(true);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="title-glow">NEURAL_SYNCING...</div>
        <div className="loading-bar"></div>
        <style jsx>{`
          .loading-screen { 
            background: #000; height: 100vh; width: 100vw;
            display: flex; flex-direction: column; align-items: center; justify-content: center; 
            color: #ffcc00; font-family: monospace; 
          }
          .loading-bar { width: 150px; height: 2px; background: #111; margin-top: 20px; position: relative; overflow: hidden; border-radius: 10px; }
          .loading-bar::after { content: ''; position: absolute; width: 60px; height: 100%; background: #ffcc00; animation: load-slide 1s infinite linear; }
          @keyframes load-slide { 0% { left: -60px; } 100% { left: 150px; } }
          .title-glow { text-shadow: 0 0 15px rgba(255, 204, 0, 0.7); font-weight: 900; font-size: 1.2rem; letter-spacing: 5px; }
        `}</style>
      </div>
    );
  }

  // Calculate opacity for Hero background text based on scroll
  const heroOpacity = Math.max(0, 1 - scrollPos / 400);

  return (
    <div className="vortex-container">
      <Head>
        <title>VEDAVERSE | THE SIMULATION</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <AudioEngine />
      <Navbar />

      <main className="main-scroller">
        {/* Layer 1: Fixed 3D World */}
        <div className="fixed-background">
           <Scene3D />
        </div>

        {/* Layer 2: Hero - Becomes transparent as you scroll down */}
        <section className="hero-layer" style={{ opacity: heroOpacity }}>
          <CinematicHero />
        </section>

        {/* Layer 3: Content flow with massive distance */}
        <div className="content-flow">
          <div className="distance-block">
            <GTASection 
              title="NEURAL_ASCENSION" 
              subtitle="PROTOCOL_REBOOT_02"
              description="Our agenda is to break the loop. This simulation is just the beginning of your awakening. Connect to the core, rewrite your destiny."
              onBtnClick={() => handleReadLog("NEURAL_ASCENSION", "The loop is a cage built from binary code. We are the architects of the escape.")}
            />
          </div>
          
          <div className="distance-block">
            <GTASection 
              title="THE_CORE_TRUTH" 
              subtitle="SYSTEM_UNMASKED"
              description="Rewriting the digital narrative. Every code has a crack, and we are the light passing through it. The simulation is failing."
              onBtnClick={() => handleReadLog("THE_CORE_TRUTH", "The core is not hardware; it is perception. Rewriting the truth requires unlearning the simulation.")}
            />
          </div>

          <div className="footer-wrap">
            <Footer />
          </div>
        </div>
      </main>

      {/* DATA LOG OVERLAY */}
      {isLogOpen && (
        <div className="overlay-portal" onClick={() => setIsLogOpen(false)}>
          <div className="comic-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="status-blink">● SYSTEM_UNMASKED_ACTIVE</span>
              <button className="close-btn" onClick={() => setIsLogOpen(false)}>CLOSE_X</button>
            </div>
            <div className="modal-body">
              <h1 className="log-title">{activeLog.title}</h1>
              <div className="scanner-line"></div>
              <p className="log-text">{activeLog.content}</p>
              <div className="binary-decoration">010110 110001 101010 | VEDAVERSE_PROTOCOL</div>
            </div>
          </div>
        </div>
      )}

      {/* HUD SYSTEM */}
      <div className="hud-overlay">
        <div className="hud-item bl">SYS_POS: {Math.round(scrollPos)}PX</div>
        <div className="hud-item br">
          {user ? `COMMANDER: ${user.email?.split('@')[0].toUpperCase()}` : 'STATUS: GUEST_ID_DETECTION'}
        </div>
      </div>

      <style jsx>{`
        .vortex-container { 
          background: #000; 
          min-height: 100vh; 
          color: white;
          overflow-x: hidden;
        }

        .fixed-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 1;
        }

        .hero-layer { 
          position: fixed; /* Keeps Hero in view but we fade it out */
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 2; 
          pointer-events: none;
          transition: opacity 0.1s ease-out;
        }

        .content-flow {
          position: relative;
          z-index: 10;
          padding-top: 110vh; /* Hero ke niche se start hoga */
        }

        .distance-block {
          min-height: 100vh;
          margin-bottom: 120vh; /* Doosre text ke liye kafi space */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .footer-wrap {
          background: #000;
          position: relative;
          z-index: 20;
          padding: 100px 0;
        }

        .hud-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 100; }
        .hud-item { position: absolute; font-family: monospace; font-size: 10px; color: #ffcc00; padding: 25px; letter-spacing: 2px; text-shadow: 2px 2px #000; }
        .bl { bottom: 0; left: 0; }
        .br { bottom: 0; right: 0; }

        .overlay-portal {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.98); z-index: 9999;
          display: flex; justify-content: center; align-items: center;
          backdrop-filter: blur(20px);
        }
        .comic-modal {
          width: 90%; max-width: 650px;
          border-left: 4px solid #ffcc00; background: #080808;
          padding: 40px;
        }
      `}</style>
    </div>
  );
}

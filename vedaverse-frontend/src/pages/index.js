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
  const [isMobile, setIsMobile] = useState(false);
  
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [activeLog, setActiveLog] = useState({ title: '', content: '' });

  useEffect(() => {
    const handleResize = () => {
      // Screen width check or orientation check
      setIsMobile(window.innerWidth < 768 || window.innerHeight > window.innerWidth);
    };

    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollPos(window.scrollY);
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const unsubscribe = onAuthStateChanged(auth, (u) => { 
      setUser(u); 
      setLoading(false); 
    });

    return () => {
      window.removeEventListener('resize', handleResize);
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

  const heroOpacity = Math.max(0, 1 - scrollPos / 400);
  const heroMoveUp = -scrollPos * 0.8;

  return (
    <div className="vortex-container">
      <Head>
        <title>VEDAVERSE | THE SIMULATION</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      <AudioEngine />
      <Navbar />

      <main className={`main-scroller ${isMobile ? 'mobile-mode' : 'pc-mode'}`}>
        
        {/* 3D Background - Hidden or Static on Mobile */}
        <div className="fixed-background">
           <Scene3D />
        </div>

        {/* Hero Layer - PC par animated, Mobile par simple scrollable */}
        {!isMobile && (
          <section className="hero-layer" style={{ 
            opacity: heroOpacity,
            transform: `translateY(${heroMoveUp}px)`,
            pointerEvents: 'none', 
            visibility: heroOpacity <= 0 ? 'hidden' : 'visible',
            zIndex: 15
          }}>
            <CinematicHero />
          </section>
        )}

        {/* Content - Responsive paddings applied */}
        <div className="content-flow">
          <div className="distance-block first-block">
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

      {/* Overlay Modals */}
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

      {/* HUD Overlay - Hidden on Mobile for clean UI */}
      <div className="hud-overlay" style={{ display: isMobile ? 'none' : 'block' }}>
        <div className="hud-item bl">SYS_POS: {Math.round(scrollPos)}PX</div>
        <div className="hud-item br">
          {user ? `COMMANDER: ${user.email?.split('@')[0].toUpperCase()}` : 'STATUS: GUEST_ID_DETECTION'}
        </div>
      </div>

      <style jsx>{`
        .vortex-container { 
          background: #000; min-height: 100vh; color: white; width: 100%; position: relative;
        }

        .fixed-background {
          position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
          z-index: 1;
        }

        .hero-layer { 
          position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.2s ease-out;
          z-index: 15;
          pointer-events: none;
        }

        .content-flow {
          position: relative;
          z-index: 20;
          padding-top: ${isMobile ? '80vh' : '150vh'};
        }

        .distance-block { 
          min-height: 100vh; 
          margin-bottom: ${isMobile ? '20vh' : '100vh'}; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          padding: 0 20px;
        }

        .footer-wrap { background: #000; position: relative; z-index: 30; padding: 100px 0; }
        
        .hud-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 100; }
        .hud-item { position: absolute; font-family: monospace; font-size: 10px; color: #ffcc00; padding: 25px; letter-spacing: 2px; text-shadow: 2px 2px #000; }
        .bl { bottom: 0; left: 0; }
        .br { bottom: 0; right: 0; }

        .overlay-portal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.98); z-index: 9999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(20px); }
        .comic-modal { width: 90%; max-width: 650px; border-left: 4px solid #ffcc00; background: #080808; padding: 40px; }

        @media (max-width: 768px) {
          .content-flow { padding-top: 60vh; }
          .distance-block { margin-bottom: 30vh; }
          .comic-modal { padding: 20px; width: 95%; }
        }
      `}</style>
    </div>
  );
}

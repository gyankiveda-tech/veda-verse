import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isNewYear, setIsNewYear] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile ke liye toggle
  const cartCount = 0; 

  const clickAudio = useRef(null);
  const bgMusicWarmup = useRef(null);

  useEffect(() => {
    clickAudio.current = new Audio('/sounds/click.mp3');
    clickAudio.current.preload = "auto";
    bgMusicWarmup.current = new Audio('/assets/veda-theme.mp3');
    bgMusicWarmup.current.preload = "auto"; 
    bgMusicWarmup.current.load();

    const currentYear = new Date().getFullYear();
    if (currentYear >= 2026) setIsNewYear(true);
  }, []);

  const playClick = () => {
    if (clickAudio.current) {
      clickAudio.current.currentTime = 0;
      clickAudio.current.play().catch(() => {});
    }
    setMenuOpen(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const isActive = (path) => router.pathname === path;
  const themeColor = isNewYear ? '#00f2ff' : 'var(--electric-gold)';

  const navLinkStyle = (path) => ({
    color: isActive(path) ? themeColor : '#ffffff',
    textDecoration: 'none',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    transition: '0.3s ease',
    cursor: 'pointer',
    fontWeight: isActive(path) ? 'bold' : 'normal',
    textShadow: isActive(path) ? `0 0 10px ${isNewYear ? 'rgba(0, 242, 255, 0.5)' : 'rgba(255, 215, 0, 0.5)'}` : 'none'
  });

  return (
    <nav className="nav-container" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 5%',
      background: 'rgba(5, 5, 5, 0.95)',
      backdropFilter: 'blur(15px)',
      borderBottom: `1px solid ${isNewYear ? 'rgba(0, 242, 255, 0.3)' : 'rgba(255, 215, 0, 0.2)'}`,
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      boxShadow: isNewYear ? '0 10px 30px rgba(0, 242, 255, 0.1)' : 'none'
    }}>
      
      {/* LEFT: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {router.pathname !== "/" && (
          <button className="nav-back-btn" onClick={() => { playClick(); router.back(); }}>←</button>
        )}
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }} onClick={playClick}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h2 className="brand-title">VEDAVERSE</h2>
          </Link>
          {isNewYear && <span className="year-badge">V.2.0.26</span>}
        </div>
      </div>

      {/* MOBILE HAMBURGER (Sirf Phone par dikhega) */}
      <div className="mobile-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        <div className={`line ${menuOpen ? 'open' : ''}`}></div>
        <div className={`line ${menuOpen ? 'open' : ''}`}></div>
      </div>

      {/* RIGHT: Links (PC par Flex, Mobile par Vertical Overlay) */}
      <div className={`nav-links-wrapper ${menuOpen ? 'mobile-active' : ''}`}>
        <Link href="/chronos" style={navLinkStyle('/chronos')} onClick={playClick}>
          <span className="nav-text-pc">The Chronos</span>
          <span className="nav-text-mobile">TIMELINE</span>
        </Link>
        
        <Link href={user ? "/vault" : "/login"} style={navLinkStyle(user ? '/vault' : '/login')} onClick={playClick}>
          <span className="nav-text-pc">{user ? "My Vault" : "The Vault"}</span>
          <span className="nav-text-mobile">{user ? "IDENTITY CORE" : "VAULT ACCESS"}</span>
        </Link>

        <Link href="/studios" style={navLinkStyle('/studios')} onClick={playClick}>
          <span className="nav-text-pc">The Studio</span>
          <span className="nav-text-mobile">CREATIVE HUB</span>
        </Link>
        
        <div className="cart-container" onClick={playClick}>
          <span style={{ color: isNewYear ? '#00f2ff' : 'var(--neon-blue)', fontSize: '1.3rem' }}>🛒</span>
          <span className="cart-badge-ui">{cartCount}</span>
        </div>

        {user ? (
          <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }} onClick={playClick}>
            <div className={`profile-wrapper ${isNewYear ? 'blue-border' : ''}`}>
              <img src={user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prabhat'} alt="Profile" className="nav-avatar" />
              <span className="online-pulse"></span>
            </div>
          </Link>
        ) : (
          <Link href="/login" onClick={playClick}>
            <button className="btn-gold-ui">
              {isNewYear ? 'EVOLVE NOW' : 'ACCESS PORTAL'}
            </button>
          </Link>
        )}
      </div>

      <style jsx>{`
        /* PC Styles (Defaults) */
        .brand-title { color: ${themeColor}; fontSize: 1.6rem; margin: 0; letter-spacing: 2px; text-shadow: 0 0 15px ${themeColor}; transition: 0.3s; }
        .brand-title:hover { transform: scale(1.05); }
        .nav-back-btn { background: transparent; color: ${themeColor}; border: 1px solid ${themeColor}; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; cursor: pointer; border-radius: 4px; }
        .nav-links-wrapper { display: flex; gap: 30px; align-items: center; }
        .nav-text-mobile { display: none; }
        .mobile-menu-icon { display: none; flex-direction: column; gap: 6px; cursor: pointer; }
        .line { width: 25px; height: 2px; background: ${themeColor}; transition: 0.3s; }
        .cart-container { position: relative; cursor: pointer; display: flex; align-items: center; }
        .cart-badge-ui { position: absolute; top: -8px; right: -12px; background: ${themeColor}; color: black; border-radius: 50%; padding: 2px 6px; fontSize: 10px; fontWeight: 900; }
        .btn-gold-ui { padding: 10px 22px; fontSize: 0.75rem; fontWeight: bold; letter-spacing: 1px; background: ${themeColor}; border: none; cursor: pointer; color: #000; }
        .year-badge { background: #00f2ff; color: #000; font-size: 0.6rem; font-weight: 900; padding: 2px 6px; border-radius: 4px; box-shadow: 0 0 10px #00f2ff; margin-left: 10px; }
        .profile-wrapper { position: relative; width: 38px; height: 38px; border: 2px solid #ffcc00; border-radius: 50%; padding: 2px; }
        .nav-avatar { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
        .online-pulse { position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background: #00ff88; border-radius: 50%; border: 2px solid #000; }

        /* PHONE ONLY UPDATES */
        @media (max-width: 900px) {
          .mobile-menu-icon { display: flex; z-index: 1001; }
          .nav-text-pc { display: none; }
          .nav-text-mobile { display: block; font-size: 1.2rem; font-weight: bold; letter-spacing: 3px; }
          
          .nav-links-wrapper {
            position: fixed; top: 0; right: -100%; width: 100%; height: 100vh;
            background: rgba(5, 5, 5, 0.98); flex-direction: column;
            justify-content: center; transition: 0.4s ease-in-out;
            gap: 40px; backdrop-filter: blur(20px);
          }
          .nav-links-wrapper.mobile-active { right: 0; }
          
          .line.open:nth-child(1) { transform: rotate(45deg) translate(5px, 6px); }
          .line.open:nth-child(2) { transform: rotate(-45deg) translate(5px, -6px); }
          
          .btn-gold-ui { font-size: 1rem; padding: 15px 40px; }
        }
      `}</style>
    </nav>
  );
}

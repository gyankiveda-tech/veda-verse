import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isNewYear, setIsNewYear] = useState(false);
  const cartCount = 0; 

  // --- AUDIO REFERENCES ---
  const clickAudio = useRef(null);
  const bgMusicWarmup = useRef(null); // Background music ko "wake up" karne ke liye

  useEffect(() => {
    // 1. Click Sound Setup
    clickAudio.current = new Audio('/sounds/click.mp3');
    clickAudio.current.preload = "auto"; // Instant click feel ke liye

    // 2. Background Music Pre-Warmup (Ye sabse important fix hai)
    // Hum background music ko Navbar mein hi preload kar rahe hain bina play kiye
    // Taaki jab AudioEngine play bole, toh music pehle se memory mein ho.
    bgMusicWarmup.current = new Audio('/assets/veda-theme.mp3');
    bgMusicWarmup.current.preload = "auto"; 
    bgMusicWarmup.current.load(); // Force browser to start downloading

    const currentYear = new Date().getFullYear();
    if (currentYear >= 2026) {
      setIsNewYear(true);
    }
  }, []);

  const playClick = () => {
    if (clickAudio.current) {
      clickAudio.current.currentTime = 0;
      clickAudio.current.play().catch(() => {});
    }
  };

  // Check login status
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
    <nav style={{
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
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {router.pathname !== "/" && (
          <button className="nav-back-btn" onClick={() => { playClick(); router.back(); }}>
            ←
          </button>
        )}

        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }} onClick={playClick}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h2 style={{ 
              color: themeColor, 
              fontSize: '1.6rem', 
              margin: 0,
              textShadow: `0 0 15px ${isNewYear ? 'rgba(0, 242, 255, 0.4)' : 'rgba(255, 215, 0, 0.4)'}`,
              letterSpacing: '2px'
            }}>
              VEDAVERSE
            </h2>
          </Link>
          {isNewYear && <span className="year-badge">V.2.0.26</span>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <Link href="/chronos" style={navLinkStyle('/chronos')} onClick={playClick}>The Chronos</Link>
        <Link href={user ? "/vault" : "/login"} style={navLinkStyle(user ? '/vault' : '/login')} onClick={playClick}>
          {user ? "My Vault" : "The Vault"}
        </Link>
        <Link href="/studios" style={navLinkStyle('/studios')} onClick={playClick}>The Studio</Link>
        
        <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={playClick}>
          <span style={{ color: isNewYear ? '#00f2ff' : 'var(--neon-blue)', fontSize: '1.3rem' }}>🛒</span>
          <span style={{
            position: 'absolute', top: -8, right: -12,
            background: themeColor, color: 'black',
            borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: '900'
          }}>{cartCount}</span>
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
            <button className="btn-gold" style={{ 
              padding: '10px 22px', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px',
              background: themeColor, border: 'none', cursor: 'pointer', color: '#000'
            }}>
              {isNewYear ? 'EVOLVE NOW' : 'ACCESS PORTAL'}
            </button>
          </Link>
        )}
      </div>

      <style jsx>{`
        h2:hover { transform: scale(1.05); transition: 0.3s; }
        .nav-back-btn { background: transparent; color: ${themeColor}; border: 1px solid ${themeColor}; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; cursor: pointer; transition: 0.3s; border-radius: 4px; }
        .nav-back-btn:hover { background: ${themeColor}; color: #000; }
        .year-badge { background: #00f2ff; color: #000; font-size: 0.6rem; font-weight: 900; padding: 2px 6px; border-radius: 4px; letter-spacing: 1px; box-shadow: 0 0 10px #00f2ff; }
        .profile-wrapper { position: relative; width: 38px; height: 38px; border: 2px solid #ffcc00; border-radius: 50%; padding: 2px; transition: 0.3s; }
        .profile-wrapper.blue-border { border-color: #00f2ff; }
        .profile-wrapper:hover { box-shadow: 0 0 15px ${isNewYear ? '#00f2ff' : '#ffcc00'}; transform: translateY(-2px); }
        .nav-avatar { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
        .online-pulse { position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background: #00ff88; border-radius: 50%; border: 2px solid #000; box-shadow: 0 0 5px #00ff88; }
      `}</style>
    </nav>
  );
}
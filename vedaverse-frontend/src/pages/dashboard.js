import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [myComments, setMyComments] = useState([]);
  const [rank, setRank] = useState("Recruit");
  const [coords, setCoords] = useState({ x: 0, y: 0, gx: 0, gy: 0 });
  const router = useRouter();

  useEffect(() => {
    // 1. Mouse Tracking for 3D Tilt
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setCoords(prev => ({ ...prev, x, y }));
    };

    // 2. Gyroscope for Mobile Tilt
    const handleGyro = (e) => {
      if (e.beta && e.gamma) {
        setCoords(prev => ({ ...prev, gx: e.gamma / 45, gy: e.beta / 45 }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleGyro);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        fetchUserStats(currentUser.uid);
      }
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleGyro);
      unsubscribe();
    };
  }, [router]);

  const fetchUserStats = (userId) => {
    const q = query(collection(db, "vol1_comments"), where("userId", "==", userId));
    onSnapshot(q, (snapshot) => {
      const count = snapshot.size;
      setMyComments(snapshot.docs.map(doc => doc.data()));
      if (count > 20) setRank("Supreme Commander");
      else if (count > 10) setRank("Elite Scout");
      else if (count > 0) setRank("Veda Seeker");
      else setRank("New Recruit");
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (!user) return <div className="loading-gate">ESTABLISHING LINK...</div>;

  // Interconnected Tilt Calculation
  const tiltX = coords.y * 10 + (coords.gy * 10);
  const tiltY = coords.x * -10 + (coords.gx * -10);

  return (
    <div className="dashboard-root no-select">
      <Navbar />
      
      {/* --- TACTICAL BACKGROUND --- */}
      <div className="grid-overlay"></div>
      <div className="scanline"></div>

      <main className="deck-container">
        {/* --- 3D PROFILE HEADER --- */}
        <header 
          className="profile-header"
          style={{ transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }}
        >
          <div className="avatar-section">
            <img src={user.photoURL || 'https://via.placeholder.com/100'} className="profile-img" alt="Commander" />
            <div className="pulse-ring"></div>
          </div>
          
          <div className="info-section">
            <p className="id-tag">NEURAL_ID: {user.uid.substring(0, 12).toUpperCase()}</p>
            <h1 className="user-name">WELCOME, {user.displayName || "COMMANDER"}</h1>
            <div className="rank-container">
              <span className="rank-badge">{rank}</span>
              <span className="status-indicator">SYSTEM_ACTIVE</span>
            </div>
          </div>

          <button onClick={handleLogout} className="logout-btn">TERMINATE_SESSION</button>
        </header>

        {/* --- STATS GRID --- */}
        <div className="stats-grid">
          {[
            { label: "TRANSMISSIONS", val: myComments.length, color: "#fff" },
            { label: "VOLUMES_ACCESSED", val: "1", color: "#00ccff" },
            { label: "SYNC_STATUS", val: "ACTIVE", color: "#00ff88" }
          ].map((stat, i) => (
            <div key={i} className="stat-card" style={{ transform: `translateZ(${20}px)` }}>
              <small>{stat.label}</small>
              <h2 style={{ color: stat.color }}>{stat.val}</h2>
            </div>
          ))}
        </div>

        {/* --- DIGITAL VAULT (3D COMIC CARDS) --- */}
        <section className="vault-wrap">
          <h2 className="section-title">/ DIGITAL_VAULT /</h2>
          
          <div className="comics-container">
            <div 
              className="vault-card-3d"
              style={{ transform: `perspective(1000px) rotateY(${tiltY * 0.5}deg) rotateX(${tiltX * 0.5}deg)` }}
            >
              <div className="comic-poster">
                <img src="/comics/vol1/1.jpg" alt="Vol 1" />
                <div className="poster-overlay">
                  <span>VOLUME_01</span>
                </div>
              </div>
              <div className="comic-details">
                <h3>THE AWAKENING</h3>
                <button onClick={() => router.push('/read-vol1')} className="read-btn">
                  CONTINUE MISSION
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .dashboard-root { background: #000; min-height: 100vh; position: relative; overflow-x: hidden; color: #fff; }
        
        .grid-overlay {
          position: fixed; inset: 0;
          background-image: radial-gradient(rgba(255, 204, 0, 0.05) 1px, transparent 1px);
          background-size: 40px 40px; z-index: 1;
        }

        .deck-container { position: relative; z-index: 10; padding: 140px 5% 60px; max-width: 1400px; margin: 0 auto; }

        /* 3D Profile Header */
        .profile-header {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 204, 0, 0.1);
          padding: 40px; display: flex; align-items: center; gap: 30px;
          backdrop-filter: blur(10px); transition: transform 0.1s ease-out;
          transform-style: preserve-3d;
        }

        .avatar-section { position: relative; width: 110px; height: 110px; }
        .profile-img { width: 100%; height: 100%; border-radius: 50%; border: 2px solid #ffcc00; object-fit: cover; }
        .pulse-ring { 
          position: absolute; inset: -5px; border: 1px solid #ffcc00; border-radius: 50%; 
          animation: pulse 2s infinite; opacity: 0.5;
        }

        .user-name { font-size: 2.8rem; font-weight: 900; color: #ffcc00; margin: 5px 0; letter-spacing: -1px; }
        .id-tag { font-family: monospace; color: #444; font-size: 0.7rem; letter-spacing: 2px; }
        
        .rank-badge { background: #ffcc00; color: #000; padding: 4px 15px; font-weight: 900; font-size: 0.7rem; margin-right: 15px; }
        .status-indicator { color: #00ff88; font-family: monospace; font-size: 0.7rem; letter-spacing: 2px; }

        .logout-btn {
          margin-left: auto; background: transparent; border: 1px solid #ff4757; color: #ff4757;
          padding: 10px 20px; font-family: monospace; font-size: 0.7rem; cursor: pointer; transition: 0.3s;
        }
        .logout-btn:hover { background: #ff4757; color: #fff; box-shadow: 0 0 20px rgba(255,71,87,0.4); }

        /* Stats Section */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 40px; }
        .stat-card {
          background: #080808; border: 1px solid #1a1a1a; padding: 30px;
          transition: 0.3s; position: relative;
        }
        .stat-card:hover { border-color: #ffcc00; background: #0c0c0c; }
        .stat-card small { color: #444; letter-spacing: 3px; font-size: 0.65rem; }
        .stat-card h2 { font-size: 2.2rem; margin-top: 10px; font-weight: 900; }

        /* Vault & Comics */
        .vault-wrap { margin-top: 80px; }
        .section-title { font-size: 1rem; letter-spacing: 8px; color: #333; margin-bottom: 40px; }
        
        .vault-card-3d {
          width: 280px; background: #0a0a0a; border: 1px solid #1a1a1a;
          padding: 15px; transition: transform 0.1s ease-out;
        }
        .comic-poster { width: 100%; height: 380px; position: relative; overflow: hidden; }
        .comic-poster img { width: 100%; height: 100%; object-fit: cover; opacity: 0.6; transition: 0.4s; }
        .vault-card-3d:hover img { opacity: 1; transform: scale(1.05); }
        
        .read-btn {
          width: 100%; margin-top: 15px; padding: 15px; background: #ffcc00;
          color: #000; border: none; font-weight: 900; letter-spacing: 2px;
          cursor: pointer; clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%); transition: 0.3s;
        }
        .read-btn:hover { background: #fff; box-shadow: 0 0 30px #ffcc00; }

        @keyframes pulse { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.3); opacity: 0; } }
        
        @media (max-width: 768px) {
          .user-name { font-size: 1.8rem; }
          .profile-header { flex-direction: column; text-align: center; }
          .logout-btn { margin: 20px auto 0; }
        }
      `}</style>
    </div>
  );
}
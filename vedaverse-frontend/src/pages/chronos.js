import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

export default function ChronosTimeline() {
  const [unlockedVolumes, setUnlockedVolumes] = useState([1]);
  const [scrollPos, setScrollPos] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPos(position);
    };
    window.addEventListener('scroll', handleScroll);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists() && docSnap.data().unlocked_volumes) {
            setUnlockedVolumes(docSnap.data().unlocked_volumes);
          }
        });
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const chapters = [
    { id: 1, title: "GENESIS", subtitle: "Where Reality Shatters", date: "ERA_01" },
    { id: 2, title: "NEURAL AWAKENING", subtitle: "The First Stir", date: "ERA_02" },
    { id: 3, title: "VOID DRIFT", subtitle: "Beyond the Horizon", date: "ERA_03" },
    // 10 Tak add karo...
  ];

  return (
    <div className="chronos-root">
      <Navbar />

      {/* Hyperspace Background */}
      <div className="warp-tunnel" style={{ transform: `perspective(500px) translateZ(${scrollPos * 0.1}px)` }}></div>

      <div className="progress-hub">
        <div className="sync-label">NEURAL_SYNC_STATUS</div>
        <div className="sync-bar">
          <div className="sync-fill" style={{ width: `${(unlockedVolumes.length / 10) * 100}%` }}></div>
        </div>
        <div className="sync-percent">{unlockedVolumes.length * 10}%</div>
      </div>

      <main className="timeline-flow">
        {chapters.map((ch, index) => {
          const isUnlocked = unlockedVolumes.includes(ch.id);
          const opacity = Math.max(0, 1 - Math.abs(scrollPos - index * 600) / 1000);
          const scale = 1 + (opacity * 0.2);

          return (
            <section key={ch.id} className="time-node">
              <div 
                className={`content-card ${isUnlocked ? 'active' : 'locked'}`}
                style={{ opacity, transform: `scale(${scale})` }}
              >
                <div className="era-tag">{ch.date}</div>
                <h2 className="ch-title">{isUnlocked ? ch.title : "DATA_ENCRYPTED"}</h2>
                <p className="ch-desc">{isUnlocked ? ch.subtitle : "Unlock this era in the Vault to decrypt the timeline."}</p>
                
                {isUnlocked ? (
                  <Link href={`/read-vol${ch.id}`} className="btn-enter">ENTER_SIMULATION</Link>
                ) : (
                  <Link href="/vault" className="btn-vault">ACCESS_REQUIRED</Link>
                )}
              </div>
              <div className="connector-line"></div>
            </section>
          );
        })}
      </main>

      <Footer />

      <style jsx>{`
        .chronos-root { background: #000; min-height: 500vh; color: #fff; position: relative; }
        
        .warp-tunnel {
          position: fixed; inset: 0;
          background: radial-gradient(circle at center, #111 0%, #000 100%);
          background-image: url('https://www.transparenttextures.com/patterns/stardust.png');
          z-index: 1;
        }

        .progress-hub {
          position: fixed; left: 50px; top: 50%; transform: translateY(-50%);
          z-index: 100; border-left: 1px solid #333; padding-left: 20px;
        }
        .sync-label { font-size: 0.6rem; color: #444; letter-spacing: 2px; }
        .sync-bar { width: 4px; height: 200px; background: #111; margin: 10px 0; border-radius: 10px; overflow: hidden; }
        .sync-fill { background: #ffcc00; box-shadow: 0 0 15px #ffcc00; transition: 0.5s; }
        .sync-percent { font-family: monospace; color: #ffcc00; font-size: 1.2rem; }

        .timeline-flow { position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; padding-top: 30vh; }
        
        .time-node { height: 100vh; display: flex; flex-direction: column; align-items: center; width: 100%; }
        
        .content-card {
          width: 500px; padding: 40px; background: rgba(10, 10, 10, 0.8);
          border: 1px solid #222; backdrop-filter: blur(20px); text-align: center;
          position: relative; transition: 0.3s;
        }
        .content-card.active { border-color: #ffcc00; box-shadow: 0 0 50px rgba(255, 204, 0, 0.1); }
        .content-card.locked { filter: grayscale(1); }

        .era-tag { font-family: monospace; color: #ffcc00; font-size: 0.7rem; margin-bottom: 15px; letter-spacing: 5px; }
        .ch-title { font-size: 2.5rem; font-weight: 900; margin-bottom: 10px; }
        .ch-desc { color: #666; font-size: 0.9rem; margin-bottom: 30px; }

        .btn-enter { padding: 12px 30px; background: #ffcc00; color: #000; font-weight: bold; text-decoration: none; display: inline-block; }
        .btn-vault { padding: 12px 30px; border: 1px solid #444; color: #444; text-decoration: none; display: inline-block; }

        .connector-line { width: 1px; height: 100%; background: linear-gradient(#ffcc00, transparent); margin-top: 20px; opacity: 0.3; }

        @media (max-width: 768px) {
          .content-card { width: 90%; }
          .progress-hub { display: none; }
        }
      `}</style>
    </div>
  );
}
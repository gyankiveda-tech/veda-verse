import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

export default function Vault() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState(0);
  const [showKeypad, setShowKeypad] = useState(false);
  const [activeTarget, setActiveTarget] = useState(null); 
  const [enteredCode, setEnteredCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isError, setIsError] = useState(false); 
  const [unlockedVolumes, setUnlockedVolumes] = useState([1]);

  const clickAudio = useRef(null);
  const successAudio = useRef(null);
  const errorAudio = useRef(null);

  useEffect(() => {
    clickAudio.current = new Audio('/sounds/click.mp3');
    successAudio.current = new Audio('/sounds/success.mp3');
    errorAudio.current = new Audio('/sounds/error.mp3');
  }, []);

  const playClick = () => {
    if (clickAudio.current) {
      clickAudio.current.currentTime = 0;
      clickAudio.current.play().catch(e => {});
    }
  };

  const playSuccess = () => {
    if (successAudio.current) {
      successAudio.current.currentTime = 0;
      successAudio.current.play().catch(e => {});
    }
  };

  const playError = () => {
    if (errorAudio.current) {
      errorAudio.current.currentTime = 0;
      errorAudio.current.play().catch(e => {});
    }
  };

  const allComics = [
    { id: 1, title: "VEDA GENESIS", part: "VOL_01", path: "/read-vol1", cover: "/comics/page-1.jpg", desc: "The beginning." },
    { id: 2, title: "FIRST STIR", part: "VOL_02", path: "/read-vol2", cover: "/comics/vol2_cover.jpg", desc: "Awakening of the symbol." },
    { id: 3, title: "VOID ECHO", part: "VOL_03", path: "/read-vol3", cover: "/comics/vol3_cover.jpg", desc: "Sector 7 scanning..." }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        const userRef = doc(db, "users", user.uid);
        const unsubDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setTokens(docSnap.data().tokens_owned || 0);
            if(docSnap.data().unlocked_volumes) {
                setUnlockedVolumes(docSnap.data().unlocked_volumes);
            }
          }
          setLoading(false);
        });
        return () => unsubDoc();
      }
    });
    return () => unsubscribe();
  }, [router]);

  const verifyKey = async () => {
    if (isVerifying || !activeTarget) return;
    setIsVerifying(true);
    setIsError(false);
    try {
      const q = query(
        collection(db, "access_codes"),
        where("code", "==", enteredCode),
        where("userId", "==", auth.currentUser.uid),
        where("used", "==", false)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        playSuccess(); 
        const codeDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "access_codes", codeDoc.id), { used: true, usedAt: new Date() });
        const newUnlockedList = [...new Set([...unlockedVolumes, activeTarget])];
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { unlocked_volumes: newUnlockedList });
        setShowKeypad(false);
        setEnteredCode("");
      } else {
        playError();
        setIsError(true);
        setTimeout(() => setIsError(false), 600);
      }
    } catch (err) { console.error(err); } finally { setIsVerifying(false); }
  };

  const handleKeypadEntry = (num) => {
    playClick();
    if (num === "CLR") setEnteredCode("");
    else if (num === "OK") { if (enteredCode.length === 6) verifyKey(); }
    else if (enteredCode.length < 6) setEnteredCode(enteredCode + num);
  };

  if (loading) return <div className="loader">DECRYPTING_VAULT_INTERFACE...</div>;

  return (
    <div className="vault-page no-select">
      <Navbar />
      <div className="nebula-bg"></div>

      <main className="vault-container">
        {/* Updated Status Bar - Non-floating to prevent overlap */}
        <div className="status-bar-new">
          <div className="status-item"><span className="pulse-green"></span> ONLINE</div>
          <div className="status-item gold">⚡ {tokens} TOKENS</div>
        </div>

        <header className="header-section">
          <h1 className="cyber-h1">THE <span className="glitch-gold">VAULT</span></h1>
          <p className="scanner-text">SEARCHING_DATA_PACKETS...</p>
        </header>

        <div className="comic-grid">
          {allComics.map((item) => {
            const isUnlocked = unlockedVolumes.includes(item.id);
            return (
              <div key={item.id} className={`vault-card ${isUnlocked ? 'active' : 'locked'}`}>
                <div className="card-inner">
                  <div className="poster-area" onClick={() => { if(!isUnlocked) { playClick(); setActiveTarget(item.id); setShowKeypad(true); } }}>
                    <div className="scan-line"></div>
                    {isUnlocked ? (
                      <img src={item.cover} alt="Cover" className="cover-img" />
                    ) : (
                      <div className="lock-state">
                        <span className="lock-icon">🔒</span>
                        <p>ENCRYPTED</p>
                      </div>
                    )}
                  </div>

                  <div className="meta-area">
                    <div className="meta-labels">
                      <span className="vol-id">{item.part}</span>
                      <span className={`status-tag ${isUnlocked ? 'on' : 'off'}`}>
                        {isUnlocked ? 'DECRYPTED' : 'LOCKED'}
                      </span>
                    </div>
                    <h3>{isUnlocked ? item.title : `BLOCK_0${item.id}`}</h3>
                    {isUnlocked ? (
                      <Link href={item.path} onClick={playClick} className="read-link">ACCESS DATA</Link>
                    ) : (
                      <button className="unlock-trigger" onClick={() => { playClick(); setActiveTarget(item.id); setShowKeypad(true); }}>
                        REDEEM
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {showKeypad && (
        <div className="keypad-overlay">
          <div className={`keypad-ui ${isError ? 'shake' : ''}`}>
            <div className="ui-header">
              <span>DECRYPTION_VOL_0{activeTarget}</span>
              <button onClick={() => { playClick(); setShowKeypad(false); }} style={{background:'none', border:'none', color:'#ffcc00', fontSize:'1.5rem', cursor:'pointer'}}>×</button>
            </div>
            <div className="code-display">
              {enteredCode.padEnd(6, "•").split("").map((c, i) => (
                <span key={i} className={c !== "•" ? "digit highlight" : "digit"}>{c}</span>
              ))}
            </div>
            <div className="keys-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "CLR", 0, "OK"].map(k => (
                <button key={k} onClick={() => handleKeypadEntry(k)} className="key-btn">{k}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        .vault-page { background: #000; min-height: 100vh; position: relative; color: #fff; font-family: 'Cinzel', serif; overflow-x: hidden; }
        .nebula-bg { position: fixed; inset: 0; background: radial-gradient(circle at 50% 0%, #1a1a00 0%, #000 70%); opacity: 0.6; z-index: 0; }
        
        /* Fixed: Status bar is now part of the scroll flow */
        .status-bar-new { 
          display: flex; 
          justify-content: space-between; 
          padding: 15px 5%; 
          background: rgba(10,10,10,0.4); 
          border-bottom: 1px solid #222; 
          font-family: monospace; 
          font-size: 0.75rem; 
          margin-bottom: 30px;
          border-radius: 4px;
        }

        .pulse-green { width: 8px; height: 8px; background: #00ff88; border-radius: 50%; display: inline-block; margin-right: 5px; box-shadow: 0 0 10px #00ff88; animation: blink 1.5s infinite; }
        .gold { color: #ffcc00; text-shadow: 0 0 5px #ffcc00; }

        .vault-container { position: relative; z-index: 10; padding: 120px 20px 80px; max-width: 1200px; margin: 0 auto; width: 100%; }
        .cyber-h1 { font-size: 2.5rem; text-align: center; letter-spacing: 8px; margin-bottom: 5px; }
        .glitch-gold { color: #ffcc00; text-shadow: 0 0 20px rgba(255,204,0,0.4); }
        .scanner-text { text-align: center; color: #444; font-family: monospace; font-size: 0.6rem; letter-spacing: 2px; margin-bottom: 40px; }

        .comic-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; width: 100%; }
        
        .vault-card { background: rgba(15,15,15,0.8); border: 1px solid #1a1a1a; border-radius: 8px; padding: 12px; transition: 0.4s; }
        .vault-card:hover { border-color: #ffcc00; transform: translateY(-5px); box-shadow: 0 10px 30px rgba(255,204,0,0.1); }
        .poster-area { height: 380px; background: #050505; position: relative; overflow: hidden; border-radius: 4px; cursor: pointer; }
        
        .cover-img { width: 100%; height: 100%; object-fit: cover; }
        .lock-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #080808; }
        .lock-icon { font-size: 2.5rem; color: #1a1a1a; margin-bottom: 10px; }
        
        .meta-area { padding-top: 15px; }
        .meta-labels { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .vol-id { font-family: monospace; color: #ffcc00; font-size: 0.65rem; }
        .status-tag { font-family: monospace; font-size: 0.55rem; padding: 2px 6px; border-radius: 4px; }
        .status-tag.on { background: rgba(0,255,136,0.1); color: #00ff88; border: 1px solid #00ff88; }
        .status-tag.off { background: rgba(255,0,0,0.05); color: #ff4757; border: 1px solid #ff4757; }

        .unlock-trigger { width: 100%; padding: 10px; background: transparent; border: 1px solid #222; color: #666; cursor: pointer; font-size: 0.8rem; }
        .read-link { display: block; text-align: center; width: 100%; padding: 10px; background: #ffcc00; color: #000; font-weight: bold; text-decoration: none; font-size: 0.8rem; }

        .keypad-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .keypad-ui { background: #0a0a0a; border: 1px solid #ffcc00; padding: 20px; border-radius: 8px; width: 100%; max-width: 320px; }
        .code-display { display: flex; gap: 8px; justify-content: center; margin-bottom: 20px; }
        .digit { width: 35px; height: 45px; border-bottom: 2px solid #222; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #333; }
        .digit.highlight { color: #ffcc00; border-bottom-color: #ffcc00; }
        
        .keys-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .key-btn { padding: 12px; background: #111; border: 1px solid #222; color: #fff; font-family: monospace; cursor: pointer; font-size: 1rem; }
        .key-btn:hover { background: #ffcc00; color: #000; }

        @media (max-width: 768px) {
          .cyber-h1 { font-size: 1.8rem; letter-spacing: 4px; }
          .vault-container { padding-top: 100px; }
          .comic-grid { grid-template-columns: 1fr; gap: 20px; }
          .poster-area { height: 350px; }
        }

        @keyframes blink { 50% { opacity: 0.3; } }
        .shake { animation: shake 0.5s linear; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
      `}</style>
    </div>
  );
}
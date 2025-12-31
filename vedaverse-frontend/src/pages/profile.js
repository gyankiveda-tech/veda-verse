import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect, useState, useRef } from 'react'; // useRef add kiya
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, addDoc, updateDoc, increment } from 'firebase/firestore';
import { useRouter } from 'next/router';

// Humare naye components
import CoinRain from '../components/CoinRain';
import AssetCard from '../components/AssetCard';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(0);
  const [rank, setRank] = useState("Recruit");
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  
  const [showRecharge, setShowRecharge] = useState(false);
  const [isCoinRaining, setIsCoinRaining] = useState(false);
  const [tickerText, setTickerText] = useState("SYSTEM_ONLINE: ASSET_VALUATION_STABLE...");

  const router = useRouter();

  // --- AUDIO REFS ---
  const clickAudio = useRef(null);
  const coinAudio = useRef(null);

  useEffect(() => {
    clickAudio.current = new Audio('/sounds/click.mp3');
    coinAudio.current = new Audio('/sounds/coin.mp3');
  }, []);

  const playClick = () => {
    if (clickAudio.current) {
      clickAudio.current.currentTime = 0;
      clickAudio.current.play().catch(() => {});
    }
  };

  const playClink = () => {
    if (coinAudio.current) {
      coinAudio.current.currentTime = 0;
      coinAudio.current.volume = 0.4;
      coinAudio.current.play().catch(() => {});
    }
  };

  // --- DOPAMINE REWARD LOOP ---
  const triggerDopamineBlast = (total) => {
    setIsCoinRaining(true);
    let count = 0;
    let delay = 400;

    const sequence = () => {
      if (count < Math.min(total, 40)) {
        playClink();
        count++;
        // Sound fast hoga lekin control mein rahega
        delay = Math.max(50, delay * 0.85); 
        setTimeout(sequence, delay);
      } else {
        // 3 second baad animation band
        setTimeout(() => setIsCoinRaining(false), 3000);
      }
    };
    sequence();
  };

  // --- AUTH & DATA SYNC ---
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        
        const unsubDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setTokens(data.tokens_owned || 0);
            
            const t = data.tokens_owned || 0;
            if (t > 1000) setRank("SUPREME ARCHON");
            else if (t > 100) setRank("NEURAL VOYAGER");
            else setRank("VEDA SEEKER");
          }
        });

        return () => unsubDoc();
      }
    });
    return () => unsubscribe();
  }, [router]);

  // --- RAZORPAY HANDLER ---
  const handlePayment = async (price, tokensToReceive) => {
    const options = {
      key: "rzp_live_RxQEb3MhUjy5VY",
      amount: price * 100, 
      currency: "INR",
      name: "VEDAVERSE VAULT",
      description: `Acquiring ${tokensToReceive} Gold Assets`,
      image: "/logo.png",
      handler: async function (response) {
        try {
          triggerDopamineBlast(tokensToReceive); // Yahan coin sounds trigger honge
          const userRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(userRef, { tokens_owned: increment(tokensToReceive) });
          
          setTickerText(`TRANSACTION_COMPLETE: ${tokensToReceive} ASSETS SECURED`);
          setTimeout(() => setShowRecharge(false), 3000);
        } catch (err) {
          console.error(err);
          alert("SYNC ERROR: Assets logic failed.");
        }
      },
      prefill: { name: user?.displayName, email: user?.email },
      theme: { color: "#ffcc00" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const generateAccessCode = async () => {
    if (tokens < 1) return alert("INSUFFICIENT ASSETS. Buy Gold first.");
    playClick(); // Button click sound
    setIsExtracting(true);
    try {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      await addDoc(collection(db, "access_codes"), {
        code: newCode,
        userId: user.uid,
        used: false,
        createdAt: new Date()
      });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { tokens_owned: increment(-1) });

      setGeneratedCode(newCode);
      playClink(); // Success coin sound
    } catch (e) { 
      console.error(e);
      alert("EXTRACTION_FAILED"); 
    } finally { 
      setIsExtracting(false); 
    }
  };

  const handleLogout = async () => {
    playClick();
    await signOut(auth);
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="neural-dashboard">
      <Navbar />

      <div className="live-ticker">
        <div className="ticker-wrap">
          <span>{tickerText} • PROTOCOL_V.2.0.9 • ASSET_GATING_ACTIVE • SECURE_NODE_7G • </span>
          <span>{tickerText} • PROTOCOL_V.2.0.9 • ASSET_GATING_ACTIVE • SECURE_NODE_7G • </span>
        </div>
      </div>

      <main className="dashboard-content">
        <div className="main-stats-grid">
          <div className="user-profile-card">
            <div className="avatar-wrapper">
              <img src={user.photoURL || "/user-placeholder.png"} className="user-avatar" alt="User" />
              <div className="rank-badge-shiny">{rank}</div>
            </div>
            <h2>{user.displayName}</h2>
            <p className="id-tag">NODE_ID: {user.uid.substring(0, 10)}</p>
            <button onClick={handleLogout} className="terminate-btn">TERMINATE SESSION</button>
          </div>

          <div className="vault-balance-card">
            <div className="vault-glow-effect"></div>
            <span className="section-label">SECURED NEURAL ASSETS</span>
            <div className={`token-count ${tokens > 0 ? 'glow-gold' : ''}`}>
              ⚡ {tokens} <small>GOLD</small>
            </div>
            <p className="audit-text">SYSTEM SECURE: READY FOR DATA EXTRACTION</p>
            <button className="topup-btn" onClick={() => { playClick(); setShowRecharge(true); }}>
              ACQUIRE ASSETS
            </button>
          </div>
        </div>

        <section className="terminal-section">
          <div className="cyber-terminal">
            <div className="terminal-top">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <span className="title">ACCESS_CODE_EXTRACTOR</span>
            </div>
            <div className="terminal-main">
              {generatedCode ? (
                <div className="code-result-area">
                  <p className="status-text green-text">{"> EXTRACTION SUCCESSFUL"}</p>
                  <div className="code-output glow-text">{generatedCode}</div>
                  <p className="instruction-text">USE THIS KEY IN THE VAULT TO UNLOCK CONTENT</p>
                  <button onClick={() => { playClick(); setGeneratedCode(null); }} className="reset-trigger">EXTRACT ANOTHER</button>
                </div>
              ) : (
                <div className="action-area">
                  <p className="status-text">{isExtracting ? "> ENCRYPTING DATA..." : "> SYSTEM READY"}</p>
                  <div className="code-output blurred">000000</div>
                  <button onClick={generateAccessCode} className="extract-trigger" disabled={isExtracting || tokens < 1}>
                    {isExtracting ? "PROCESSING..." : "INITIALIZE EXTRACTION"}
                  </button>
                  {tokens < 1 && <p className="warning-text">ACQUIRE GOLD TO GENERATE KEY</p>}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {showRecharge && (
        <div className="modal-overlay" onClick={() => { playClick(); setShowRecharge(false); }}>
          <div className="acquisition-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-nav">
              <h3>NEURAL ASSET ACQUISITION</h3>
              <button className="close-btn" onClick={() => { playClick(); setShowRecharge(false); }}>×</button>
            </div>
            <div className="asset-grid-scroll">
              <AssetCard type="SINGLE NODE" amount={1} price={40} onPurchase={(p, a) => { playClick(); handlePayment(p, a); }} />
              <AssetCard type="DUAL LINK" amount={2} price={75} onPurchase={(p, a) => { playClick(); handlePayment(p, a); }} />
              <AssetCard type="DATA CLUSTER" amount={4} price={140} onPurchase={(p, a) => { playClick(); handlePayment(p, a); }} />
            </div>
          </div>
        </div>
      )}

      {isCoinRaining && <CoinRain count={60} />}
      <Footer />

      <style jsx>{`
        .neural-dashboard { background: #000; min-height: 100vh; color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; }
        .dashboard-content { padding: 140px 5% 60px; max-width: 1200px; margin: 0 auto; position: relative; z-index: 5; }
        .live-ticker { background: #ffcc00; color: #000; padding: 6px 0; font-family: monospace; font-size: 0.7rem; font-weight: 900; position: fixed; top: 70px; width: 100%; z-index: 100; border-bottom: 2px solid #000; pointer-events: none; }
        .ticker-wrap { display: inline-block; white-space: nowrap; animation: ticker 25s linear infinite; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .main-stats-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 30px; margin-bottom: 50px; }
        .user-profile-card { background: #080808; border: 1px solid #151515; padding: 40px; border-radius: 24px; text-align: center; }
        .user-avatar { width: 110px; height: 110px; border-radius: 50%; border: 2px solid #ffcc00; margin-bottom: 15px; }
        .rank-badge-shiny { background: #ffcc00; color: #000; font-size: 0.6rem; font-weight: 900; padding: 4px 10px; border-radius: 10px; display: inline-block; margin-top: -20px; position: relative; }
        .vault-balance-card { background: #080808; border: 1px solid #ffcc0033; padding: 40px; border-radius: 24px; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .token-count { font-size: 5rem; font-weight: 900; margin: 10px 0; }
        .glow-gold { color: #ffcc00; text-shadow: 0 0 30px rgba(255, 204, 0, 0.4); }
        .topup-btn { background: #ffcc00; color: #000; border: none; padding: 18px 40px; border-radius: 12px; font-weight: 900; cursor: pointer; transition: 0.3s; width: 100%; max-width: 300px; }
        .terminate-btn { background: #111; border: 1px solid #222; color: #ff4757; padding: 10px 20px; border-radius: 8px; font-size: 0.7rem; margin-top: 20px; cursor: pointer; }
        .cyber-terminal { background: #000; border: 1px solid #222; border-radius: 12px; overflow: hidden; }
        .terminal-top { background: #111; padding: 12px; display: flex; gap: 8px; align-items: center; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .red { background: #ff4757; } .yellow { background: #ffa502; } .green { background: #2ed573; }
        .terminal-main { padding: 50px 20px; text-align: center; }
        .code-output { font-size: 5rem; color: #ffcc00; font-weight: 900; letter-spacing: 12px; margin: 20px 0; font-family: monospace; }
        .blurred { filter: blur(10px); opacity: 0.2; }
        .glow-text { text-shadow: 0 0 25px rgba(255, 204, 0, 0.6); }
        .extract-trigger { background: #fff; color: #000; border: none; padding: 15px 40px; font-weight: 900; cursor: pointer; }
        .extract-trigger:disabled { opacity: 0.3; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 5000; display: flex; align-items: center; justify-content: center; }
        .acquisition-modal { background: #0a0a0a; border: 1px solid #222; width: 90%; max-width: 900px; border-radius: 30px; padding: 40px; }
        .asset-grid-scroll { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 30px; }
        .close-btn { background: transparent; border: none; color: #666; font-size: 2rem; cursor: pointer; }

        @media (max-width: 768px) {
          .main-stats-grid { grid-template-columns: 1fr; }
          .token-count { font-size: 3rem; }
          .code-output { font-size: 3rem; letter-spacing: 5px; }
        }
      `}</style>
    </div>
  );
}
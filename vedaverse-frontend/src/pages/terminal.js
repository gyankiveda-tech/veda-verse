import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function Terminal() {
  const [tokens, setTokens] = useState(0);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // 1. Fetch User Data & Tokens
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setTokens(userSnap.data().tokens_owned || 0);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. The Burning Logic (Asli Game Yahan Hai)
  const redeemToken = async () => {
    if (tokens <= 0) return alert("INSUFFICIENT TOKENS. VISIT SHOP.");
    
    setLoading(true);

    try {
      // Step A: Find an unused code from 'codes' collection
      const codesRef = collection(db, "codes");
      const q = query(codesRef, where("isUsed", "==", false), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("OUT OF STOCK: No access codes left in the system!");
        setLoading(false);
        return;
      }

      const codeDoc = querySnapshot.docs[0];
      const finalSecretCode = codeDoc.data().codeValue;

      // Step B: Update Token Count in User's profile
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        tokens_owned: tokens - 1
      });

      // Step C: Mark this code as USED so no one else gets it
      await updateDoc(doc(db, "codes", codeDoc.id), {
        isUsed: true,
        assignedTo: user.uid
      });

      // Step D: Show the results
      setGeneratedCode(finalSecretCode);
      setTokens(tokens - 1);
      
    } catch (error) {
      console.error("Extraction Error:", error);
      alert("CRITICAL ERROR: Connection to Neural Net lost.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="terminal-page no-select">
      <Navbar />
      <main className="terminal-container">
        <div className="status-bar">
          SYSTEM STATUS: <span className="green-text">ONLINE</span> // 
          USER_WALLET: <span className="gold-text">{tokens} TOKENS</span>
        </div>
        
        <div className="exchange-box">
          <h1 className="terminal-title">CODE <span className="gold-text">EXTRACTOR</span></h1>
          <p className="sub-text">Decrypting a Multiplex Access Code costs 1 Neural Token.</p>

          <div className="machine-ui">
            {loading ? (
              <div className="deciphering">
                <div className="glitch-loader"></div>
                <p className="loading-text">DECRYPTING NEURAL DATA...</p>
              </div>
            ) : generatedCode ? (
              <div className="code-display animate-flicker">
                <p className="label">DECRYPTION SUCCESSFUL:</p>
                <h2 className="final-code">{generatedCode}</h2>
                <button className="copy-btn" onClick={() => {
                  navigator.clipboard.writeText(generatedCode);
                  alert("Code Copied!");
                }}>COPY TO CLIPBOARD</button>
                <p className="warning-note">Save this code. It can only be used once in the Vault.</p>
              </div>
            ) : (
              <div className="initial-state">
                <button className="burn-btn" onClick={redeemToken}>
                   BURN 1 TOKEN
                </button>
                <p className="token-hint">Tokens remaining: {tokens}</p>
              </div>
            )}
          </div>
        </div>

        <div className="vault-link">
          <p>Ready to unlock? <a href="/vault" className="gold-link">GO TO VAULT</a></p>
        </div>
      </main>

      <style jsx>{`
        .terminal-page { background: #000; min-height: 100vh; color: #fff; }
        .terminal-container { padding: 160px 5% 50px; max-width: 800px; margin: 0 auto; text-align: center; }
        .status-bar { font-family: monospace; font-size: 0.75rem; letter-spacing: 3px; color: #444; margin-bottom: 40px; }
        .green-text { color: #00ff88; }
        .gold-text { color: var(--electric-gold); }
        
        .exchange-box { background: rgba(5,5,5,0.8); border: 1px solid #111; padding: 60px 40px; border-radius: 4px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .terminal-title { font-size: 3.5rem; font-weight: 900; margin: 0; letter-spacing: -2px; }
        .sub-text { color: #555; font-size: 0.85rem; margin-top: 15px; letter-spacing: 1px; }

        .machine-ui { margin-top: 50px; min-height: 250px; display: flex; align-items: center; justify-content: center; }
        
        .burn-btn {
          background: transparent; border: 2px solid var(--electric-gold); color: var(--electric-gold);
          padding: 25px 50px; font-size: 1.2rem; font-weight: 900; cursor: pointer;
          transition: 0.4s; letter-spacing: 3px;
        }
        .burn-btn:hover { background: var(--electric-gold); color: #000; transform: scale(1.05); box-shadow: 0 0 40px rgba(255,215,0,0.2); }
        .token-hint { font-size: 0.7rem; color: #333; margin-top: 15px; letter-spacing: 2px; }

        .code-display { background: #000; border: 1px solid #222; padding: 40px; border-left: 5px solid var(--electric-gold); width: 100%; }
        .final-code { font-size: 3.2rem; color: #fff; margin: 20px 0; letter-spacing: 8px; font-family: 'Courier New', monospace; text-shadow: 0 0 15px rgba(255,255,255,0.2); }
        .copy-btn { background: var(--electric-gold); color: #000; border: none; padding: 12px 25px; font-weight: 900; cursor: pointer; font-size: 0.8rem; }
        .warning-note { font-size: 0.65rem; color: #ff4444; margin-top: 20px; letter-spacing: 1px; text-transform: uppercase; }
        
        .loading-text { color: var(--electric-gold); letter-spacing: 4px; font-size: 0.7rem; margin-top: 20px; }
        .glitch-loader { width: 60px; height: 60px; border: 2px solid #111; border-top: 2px solid var(--electric-gold); border-radius: 50%; animation: spin 0.8s infinite linear; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .vault-link { margin-top: 40px; font-size: 0.8rem; color: #444; }
        .gold-link { color: var(--electric-gold); text-decoration: none; font-weight: bold; border-bottom: 1px solid transparent; }
        .gold-link:hover { border-bottom: 1px solid var(--electric-gold); }
      `}</style>
    </div>
  );
}
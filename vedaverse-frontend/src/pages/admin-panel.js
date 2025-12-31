import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';

export default function AdminPanel() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sabhi user ke uploads ko live track karne ke liye
    const q = query(collection(db, "transactions"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAction = async (transId, userId, action) => {
    try {
      const transRef = doc(db, "transactions", transId);
      const userRef = doc(db, "users", userId);

      if (action === 'APPROVE') {
        await updateDoc(transRef, { status: 'SUCCESS' });
        alert("Transaction Verified!");
      } 
      else if (action === 'FRAUD') {
        // User ko ban karna aur tokens kaatna
        await updateDoc(userRef, { 
          tokens_owned: 0, 
          isBanned: true 
        });
        await updateDoc(transRef, { status: 'FRAUD_DETECTED' });
        alert("🚨 FRAUD DETECTED: User tokens wiped and account restricted.");
      }
    } catch (err) {
      alert("Error: Action failed.");
    }
  };

  return (
    <div className="admin-bg">
      <Navbar />
      <div className="container">
        <div className="header">
          <h1>VEDA_ADMIN_VAULT 🛡️</h1>
          <p>Reviewing all incoming neural energy transfers.</p>
        </div>

        {loading ? <div className="loader">SYNCING DATABASE...</div> : (
          <div className="grid">
            {transactions.map((t) => (
              <div key={t.id} className={`card ${t.status === 'FRAUD_DETECTED' ? 'fraud' : ''}`}>
                <div className="img-container">
                  <img src={t.imageUrl} alt="Proof" />
                </div>
                <div className="info">
                  <p><strong>USER:</strong> {t.userId.substring(0, 8)}...</p>
                  <p><strong>AI_UTR:</strong> <span className="gold-text">{t.utr_id}</span></p>
                  <p className="status">STATUS: {t.status}</p>
                </div>
                <div className="btn-group">
                  <button className="ok" onClick={() => handleAction(t.id, t.userId, 'APPROVE')}>✓ APPROVE</button>
                  <button className="no" onClick={() => handleAction(t.id, t.userId, 'FRAUD')}>✕ FRAUD</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-bg { background: #000; min-height: 100vh; color: white; padding-top: 100px; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { border-bottom: 1px solid #222; margin-bottom: 30px; padding-bottom: 20px; }
        h1 { color: #ffcc00; font-family: monospace; letter-spacing: 2px; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; overflow: hidden; }
        .card.fraud { border-color: #ff4757; }
        
        .img-container { height: 250px; background: #111; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .img-container img { width: 100%; height: 100%; object-fit: contain; }
        
        .info { padding: 15px; font-size: 0.8rem; border-bottom: 1px solid #111; }
        .gold-text { color: #ffcc00; font-family: monospace; }
        .status { margin-top: 5px; color: #666; font-size: 0.7rem; }
        
        .btn-group { display: flex; }
        button { flex: 1; padding: 12px; border: none; font-weight: bold; cursor: pointer; transition: 0.3s; }
        .ok { background: #00ff88; color: #000; }
        .no { background: #ff4757; color: #fff; }
        button:hover { opacity: 0.8; }
      `}</style>
    </div>
  );
}
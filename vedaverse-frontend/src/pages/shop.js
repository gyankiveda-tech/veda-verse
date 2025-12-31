import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';

export default function Shop() {
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [selectedPack, setSelectedPack] = useState(null);

  // MANIPULATION LOGIC: Fake original prices to create an illusion of a massive sale
  const packs = [
    { 
      id: 'solo', name: 'SOLO PULSE', qty: 1, 
      inr: 40, usd: 0.50, 
      originalInr: 60, originalUsd: 0.80, // Fake Original
      discount: '33% OFF', tag: 'STARTER PACK' 
    },
    { 
      id: 'duo', name: 'DUO ARCHIVE', qty: 2, 
      inr: 70, usd: 0.90, 
      originalInr: 120, originalUsd: 1.60, // Fake Original
      discount: '42% OFF', tag: 'POPULAR' 
    },
    { 
      id: 'saga', name: 'SAGA BUNDLE', qty: 5, 
      inr: 150, usd: 1.80, 
      originalInr: 375, originalUsd: 4.50, // Fake Original (Huge gap for manipulation)
      discount: '60% OFF', tag: 'ULTIMATE VALUE', highlight: true 
    }
  ];

  return (
    <div className="shop-page no-select">
      <Navbar />
      
      <main className="shop-container">
        <div className="shop-header">
          <h1 className="heavy-text">TRADE <span className="gold-text">CENTER</span></h1>
          <div className="live-status">
            <span className="blink-dot"></span> 
            BLACK MARKET RATES SYNCED // <span className="timer">OFFER ENDS IN 14:21:05</span>
          </div>
        </div>

        {/* --- THE BUNDLE GRID (MANIPULATION ZONE) --- */}
        <div className="bundle-grid">
          {packs.map((pack) => (
            <div 
              key={pack.id} 
              className={`pack-card ${pack.highlight ? 'highlight' : ''} ${selectedPack?.id === pack.id ? 'selected' : ''}`}
              onClick={() => setSelectedPack(pack)}
            >
              <div className="discount-tag">{pack.discount}</div>
              <div className="pack-tag">{pack.tag}</div>
              <h2 className="pack-name">{pack.name}</h2>
              <div className="token-count">{pack.qty} TOKENS</div>
              
              <div className="price-box">
                <span className="fake-price">
                  {selectedCurrency === 'INR' ? `₹${pack.originalInr}` : `$${pack.originalUsd}`}
                </span>
                <span className="actual-price">
                  {selectedCurrency === 'INR' ? `₹${pack.inr}` : `$${pack.usd}`}
                </span>
              </div>

              <div className="per-token-math">
                 ({selectedCurrency === 'INR' ? `₹${(pack.inr/pack.qty).toFixed(0)}` : `$${(pack.usd/pack.qty).toFixed(2)}`} per unit)
              </div>
            </div>
          ))}
        </div>

        <div className="trade-grid">
          {/* Left Side: The Payment Scanner */}
          <div className="payment-booth">
            <div className="booth-top">SECURE PAYMENT GATEWAY</div>
            <div className="qr-area">
              <div className="qr-placeholder">
                <div className="qr-scanner-line"></div>
                {selectedPack ? (
                  <div className="checkout-active">
                    <p className="glitch-text" data-text="INITIALIZING TRANSACTION">INITIALIZING TRANSACTION</p>
                    <h2 className="pay-amount">
                        {selectedCurrency === 'INR' ? `₹${selectedPack.inr}` : `$${selectedPack.usd}`}
                    </h2>
                    <p className="pack-confirm">CONFIRMING {selectedPack.qty} TOKENS</p>
                  </div>
                ) : (
                  <p className="idle-text">WAITING FOR PACK SELECTION...</p>
                )}
              </div>
            </div>
            
            <div className="currency-switch">
              <button className={selectedCurrency === 'INR' ? 'active' : ''} onClick={() => setSelectedCurrency('INR')}>₹ INR</button>
              <button className={selectedCurrency === 'USD' ? 'active' : ''} onClick={() => setSelectedCurrency('USD')}>$ USD</button>
            </div>
          </div>

          {/* Right Side: Instructions */}
          <div className="intel-box">
            <h2 className="intel-title">INTEL: ACQUISITION PROCESS</h2>
            <div className="intel-steps">
              <div className="step">
                <span className="step-num">01</span>
                <p>Select your <b>Token Bundle</b>. Larger packs bypass local trade taxes.</p>
              </div>
              <div className="step">
                <span className="step-num">02</span>
                <p>Scan the QR and pay exact amount. Send proof to the <b>Trade Agent</b>.</p>
              </div>
              <div className="step">
                <span className="step-num">03</span>
                <p>Tokens will be synced to your <b>Neural ID</b>. Use them in the Vault.</p>
              </div>
            </div>
            
            <div className="warning-note">
              ⚠ SYSTEM ALERT: Tokens are non-transferable. 100% Secure.
            </div>
            
            <button className="contact-agent-btn">CONNECT WITH AGENT</button>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .shop-page { background: #000; min-height: 100vh; color: #fff; }
        .shop-container { padding: 150px 5% 100px; max-width: 1200px; margin: 0 auto; }
        .heavy-text { font-size: 5rem; font-weight: 900; letter-spacing: -3px; margin: 0; }
        .gold-text { color: var(--electric-gold); }
        .live-status { color: #444; font-size: 0.7rem; letter-spacing: 3px; margin-bottom: 40px; }
        .blink-dot { height: 8px; width: 8px; background: #ff0000; border-radius: 50%; display: inline-block; margin-right: 10px; animation: blink 1s infinite; }
        .timer { color: #888; }

        /* Manipulation Cards */
        .bundle-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 60px; }
        .pack-card { 
            background: #080808; border: 1px solid #1a1a1a; padding: 40px 20px; 
            text-align: center; cursor: pointer; transition: 0.3s; position: relative; overflow: hidden;
        }
        .pack-card:hover { border-color: #444; transform: translateY(-5px); }
        .pack-card.selected { border-color: var(--electric-gold); background: #0c0c05; box-shadow: 0 0 30px rgba(255, 215, 0, 0.05); }
        
        .discount-tag { position: absolute; top: 10px; left: 10px; background: #ff0000; color: #fff; font-size: 0.6rem; font-weight: 900; padding: 2px 8px; }
        .pack-card.highlight::after {
            content: "RECOMMENDED"; position: absolute; top: 15px; right: -30px;
            background: var(--electric-gold); color: #000; font-size: 0.5rem;
            font-weight: 900; padding: 3px 40px; transform: rotate(45deg);
        }

        .pack-tag { font-size: 0.6rem; color: #444; margin-bottom: 10px; letter-spacing: 2px; }
        .pack-name { font-size: 1.5rem; font-weight: 900; margin: 0; }
        .token-count { font-size: 0.8rem; color: var(--electric-gold); margin: 10px 0; }
        
        .price-box { margin: 20px 0; display: flex; flex-direction: column; }
        .fake-price { text-decoration: line-through; color: #444; font-size: 0.9rem; }
        .actual-price { font-size: 2.5rem; font-weight: 900; line-height: 1; }
        .per-token-math { font-size: 0.7rem; color: #333; margin-top: 10px; }

        /* Trade Grid */
        .trade-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 50px; }
        .payment-booth { background: #0a0a0a; border: 1px solid #222; padding: 30px; position: relative; }
        .booth-top { position: absolute; top: -10px; left: 20px; background: #ff0000; color: #fff; font-size: 0.6rem; padding: 2px 10px; font-weight: 900; }
        .qr-area { background: #000; height: 320px; border: 1px dashed #333; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; text-align: center; }
        .pay-amount { color: var(--electric-gold); font-size: 3.5rem; margin: 10px 0; letter-spacing: -2px; }
        .pack-confirm { font-size: 0.7rem; color: #444; letter-spacing: 2px; }
        .idle-text { color: #222; font-weight: 900; letter-spacing: 1px; }

        .currency-switch { display: flex; gap: 10px; margin-top: 20px; }
        .currency-switch button { flex: 1; padding: 12px; background: #000; border: 1px solid #222; color: #444; cursor: pointer; font-weight: 900; font-size: 0.7rem; transition: 0.2s; }
        .currency-switch button.active { border-color: var(--electric-gold); color: var(--electric-gold); }

        .intel-box { background: #050505; border-left: 2px solid var(--electric-gold); padding: 40px; }
        .intel-title { font-size: 1.2rem; letter-spacing: 2px; margin-bottom: 30px; color: var(--electric-gold); }
        .step { display: flex; gap: 15px; margin-bottom: 25px; }
        .step-num { font-size: 0.8rem; font-weight: 900; color: #000; background: #fff; min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        .step p { color: #666; font-size: 0.8rem; line-height: 1.5; margin: 0; }
        .contact-agent-btn { width: 100%; padding: 15px; background: var(--electric-gold); color: #000; border: none; font-weight: 900; cursor: pointer; transition: 0.3s; margin-top: 20px; }
        .contact-agent-btn:hover { background: #fff; transform: translateY(-3px); }

        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        @media (max-width: 768px) {
          .trade-grid, .bundle-grid { grid-template-columns: 1fr; }
          .heavy-text { font-size: 3rem; }
        }
      `}</style>
    </div>
  );
}
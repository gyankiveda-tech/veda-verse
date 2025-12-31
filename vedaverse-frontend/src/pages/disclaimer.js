import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Disclaimer() {
  return (
    <div className="policy-root">
      <Navbar />

      <main className="policy-container">
        <header className="policy-header">
          <h1 className="glow-text">SYSTEM_DISCLAIMER</h1>
          <p className="last-updated">ID_REF: VEDA_CORE_SAFETY_01</p>
        </header>

        <section className="policy-section">
          <h2>1. FICTIONAL CONTENT</h2>
          <p>
            VedaVerse par dikhayi gayi saari kahaniyan, characters aur events <strong>kalpanik (fictional)</strong> hain. 
            Inka kisi bhi zinda ya mrit vyakti, sanstha ya vastavik ghatna se koi talluq nahi hai. 
            Hum kisi bhi dharmik ya samajik bhavna ko thes pahunchane ka irada nahi rakhte.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. FINANCIAL RISK</h2>
          <p>
            VedaVerse ke <strong>Gold Tokens</strong> sirf digital assets hain. Inki koi "Real World" cash value nahi hai. 
            User apni marzi aur samajh-bujh kar hi tokens acquire karein. Hum kisi bhi tarah ke 
            financial loss ke liye zimmedar nahi honge.
          </p>
        </section>

        <section className="policy-section">
          <h2>3. EXTERNAL LINKS</h2>
          <p>
            Hamari website par kabhi-kabhi third-party links (jaise Razorpay ya Social Media) ho sakte hain. 
            Un platforms par hone wali kisi bhi activity ki zimmedari VedaVerse ki nahi hogi. 
            Kripya unki policies dhyan se padhein.
          </p>
        </section>

        <section className="policy-section">
          <h2>4. SYSTEM ERRORS</h2>
          <p>
            Hum koshish karte hain ki hamara "Neural Simulation" hamesha online rahe, lekin 
            technical glitches ya maintenance ki wajah se downtime ho sakta hai. 
            Aise waqt mein kisi bhi data loss ke liye hum badhy (liable) nahi hain.
          </p>
        </section>

        <div className="final-warning">
          <p>PROCEED WITH CAUTION: THE VEDA_VERSE IS A VOLUNTARY SIMULATION.</p>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .policy-root { background: #000; color: #fff; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .policy-container { padding: 150px 10% 80px; max-width: 900px; margin: 0 auto; line-height: 1.8; }
        
        .policy-header { margin-bottom: 60px; border-bottom: 1px solid #1a1a1a; padding-bottom: 20px; }
        .glow-text { font-size: 2.5rem; color: #ffcc00; text-shadow: 0 0 15px rgba(255, 204, 0, 0.2); }
        .last-updated { font-family: monospace; color: #444; font-size: 0.8rem; margin-top: 10px; }

        .policy-section { margin-bottom: 40px; }
        h2 { color: #ffcc00; font-size: 1.2rem; margin-bottom: 15px; letter-spacing: 1px; }
        p { color: #aaa; font-size: 1rem; }
        strong { color: #fff; }

        .final-warning { 
          margin-top: 60px; padding: 25px; border: 1px solid #ffcc0033;
          text-align: center; font-family: monospace; color: #ffcc00; 
          background: rgba(255, 204, 0, 0.05); border-radius: 12px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }

        @media (max-width: 768px) {
          .policy-container { padding-top: 100px; }
          .glow-text { font-size: 1.8rem; }
        }
      `}</style>
    </div>
  );
}
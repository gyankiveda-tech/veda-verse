import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Refund() {
  return (
    <div className="policy-root">
      <Navbar />

      <main className="policy-container">
        <header className="policy-header">
          <h1 className="glow-text">REFUND_&_CANCELLATION</h1>
          <p className="last-updated">PROTOCOL_REF: VEDA_PAY_2025</p>
        </header>

        <section className="policy-section">
          <h2>1. DIGITAL ASSET NATURE</h2>
          <p>
            VedaVerse ke saare transactions <strong>Digital Neural Assets (Gold Tokens)</strong> ke liye hain. 
            Ek baar jab tokens aapke account mein credit ho jaate hain, wo turant consume hone ke liye 
            available hote hain, isliye hum kisi bhi condition mein <strong>Refund issue nahi karte</strong>.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. FAILED TRANSACTIONS</h2>
          <p>
            Agar aapke bank account se paisa kat gaya hai lekin tokens 24 ghante ke andar credit nahi huye, 
            toh ye ek "Sync Error" ho sakta hai. Aisi sthiti mein humein transaction screenshot ke saath 
            <strong> financehubstudio@gmail.com</strong> par mail karein. Hum manually verification ke baad 
            tokens credit kar denge.
          </p>
        </section>

        <section className="policy-section">
          <h2>3. CANCELLATION POLICY</h2>
          <p>
            Kyuki humara delivery system instant hai, order place hone ke baad <strong>Cancellation 
            possible nahi hai</strong>. User se anurodh hai ki wo payment karne se pehle tokens ki 
            quantity check kar lein.
          </p>
        </section>

        <section className="policy-section">
          <h2>4. DUPLICATE PAYMENTS</h2>
          <p>
            Agar galti se ek hi order ke liye do baar payment ho jati hai, toh extra amount hum 
            original payment source mein 5-7 working days ke andar refund kar denge.
          </p>
        </section>

        <div className="support-footer">
          <p>SUPPORT_LINE: +91 8521077293</p>
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
        h2 { color: #ffcc00; font-size: 1.2rem; margin-bottom: 15px; letter-spacing: 1px; text-transform: uppercase; }
        p { color: #aaa; font-size: 1rem; }
        strong { color: #fff; }

        .support-footer { 
          margin-top: 60px; padding: 20px; border-top: 1px solid #151515;
          text-align: center; font-family: monospace; color: #ffcc00; font-weight: bold;
        }

        @media (max-width: 768px) {
          .policy-container { padding-top: 100px; }
          .glow-text { font-size: 1.6rem; }
        }
      `}</style>
    </div>
  );
}
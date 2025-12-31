import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="policy-root">
      <Navbar />

      <main className="policy-container">
        <header className="policy-header">
          <h1 className="glow-text">TERMS_OF_SERVICE</h1>
          <p className="last-updated">VERSION: 2.0.25 | LEGAL_NODE_ACTIVE</p>
        </header>

        <section className="policy-section">
          <h2>1. ACCEPTANCE OF TERMS</h2>
          <p>
            VedaVerse simulation mein enter karke aap hamare terms ko accept karte hain. 
            Agar aap in rules se sehmat nahi hain, toh kripya simulation (website) ko turant terminate kar dein.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. INTELLECTUAL PROPERTY</h2>
          <p>
            VedaVerse ka saara content (Comics, Art, Lore, Code) hamari property hai. 
            Inhe copy karna, distribute karna ya kisi dusre platform par dikhana <strong>sakht mana hai</strong>. 
            Copyright violation par legal action liya ja sakta hai.
          </p>
        </section>

        <section className="policy-section">
          <h2>3. ACCOUNT SECURITY</h2>
          <p>
            Aapke <strong>Node ID</strong> aur password ki security aapki zimmedari hai. 
            Agar aapke account se koi unauthorized transaction hota hai, toh VedaVerse uske liye 
            zimmedar nahi hoga. Hum suggest karte hain ki aap apna login kisi ke saath share na karein.
          </p>
        </section>

        <section className="policy-section">
          <h2>4. NEURAL ASSETS (TOKENS)</h2>
          <p>
            Gold Tokens sirf VedaVerse ke andar use karne ke liye hain. Inhe real money mein convert nahi 
            kiya ja sakta aur na hi kisi dusre user ko transfer kiya ja sakta hai. 
            Inki value kisi bhi waqt system protocols ke mutabiq badli ja sakti hai.
          </p>
        </section>

        <section className="policy-section">
          <h2>5. TERMINATION</h2>
          <p>
            Hum kisi bhi account ko bina notice diye terminate kar sakte hain agar wo hamare rules 
            ya community guidelines ko todta hai. Termination ke baad aapke bache huye tokens expire ho jayenge.
          </p>
        </section>

        <div className="legal-footer">
          <p>GOVERNED BY THE LAWS OF INDIA | JURISDICTION: PATNA, BIHAR</p>
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

        .legal-footer { 
          margin-top: 60px; padding: 20px; background: rgba(255, 204, 0, 0.02);
          border: 1px solid #111; text-align: center;
          font-size: 0.7rem; color: #333; letter-spacing: 2px;
        }

        @media (max-width: 768px) {
          .policy-container { padding-top: 100px; }
          .glow-text { font-size: 1.8rem; }
        }
      `}</style>
    </div>
  );
}
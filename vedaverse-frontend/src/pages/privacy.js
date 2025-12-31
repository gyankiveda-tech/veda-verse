import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div className="policy-root">
      <Navbar />

      <main className="policy-container">
        <header className="policy-header">
          <h1 className="glow-text">PRIVACY_PROTOCOL_V2</h1>
          <p className="last-updated">LAST_SYNC: DECEMBER 2025</p>
        </header>

        <section className="policy-section">
          <h2>1. DATA ENCRYPTION</h2>
          <p>
            VedaVerse mein aapka data hamari priority hai. Hum aapka personal info (Email, Name) 
            <strong> Firebase Secure Layers</strong> mein encrypt karke rakhte hain. Hum aapka 
            password kabhi store nahi karte, wo direct Google Auth ke zariye handle hota hai.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. NEURAL COOKIES (TRACKING)</h2>
          <p>
            Hum "Smart Cookies" ka use karte hain taaki humein pata chale ki aap simulation mein 
            kahan tak pahunche hain. Ye cookies sirf aapka <strong>Login Session</strong> aur 
            <strong>Theme Preferences</strong> yaad rakhti hain. Hum kisi bhi third-party ko 
            aapka data sell nahi karte.
          </p>
        </section>

        <section className="policy-section">
          <h2>3. TRANSACTION SECURITY</h2>
          <p>
            Payments <strong>Razorpay Secure Gateway</strong> ke zariye process hoti hain. 
            Aapka card data ya bank details hamare server par kabhi save nahi hoti. Hum sirf 
            aapki <strong>Transaction ID</strong> rakhte hain taaki hum Tokens credit kar sakein.
          </p>
        </section>

        <section className="policy-section">
          <h2>4. USER RIGHTS</h2>
          <p>
            Aap jab chahe apna account "Terminate" kar sakte hain. Termination ke baad aapka 
            saara "Neural Data" hamare system se permanently wipe out kar diya jayega.
          </p>
        </section>

        <div className="contact-small">
          <p>Privacy concerns? Contact the Data Architect: <strong>financehubstudio@gmail.com</strong></p>
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

        .contact-small { 
          margin-top: 60px; padding: 20px; background: #080808; 
          border-radius: 10px; border: 1px solid #151515; text-align: center;
          font-size: 0.9rem; color: #666;
        }

        @media (max-width: 768px) {
          .policy-container { padding-top: 100px; }
          .glow-text { font-size: 1.8rem; }
        }
      `}</style>
    </div>
  );
}
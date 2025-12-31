import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="about-root">
      <Navbar />

      <main className="about-container">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="glitch-text">ARCHITECTS OF REALITY</h1>
          <p className="subtitle">VEDAVERSE: WHERE ANCIENT WISDOM MEETS NEURAL TECHNOLOGY</p>
        </section>

        <div className="content-grid">
          {/* Our Story */}
          <section className="story-card">
            <h2>THE GENESIS</h2>
            <p>
              VedaVerse koi sadharan comic platform nahi hai. Ye ek digital simulation hai jahan hum 
              <strong> Ancient Indian Wisdom (Vedas)</strong> ko <strong>Futuristic Cyberpunk</strong> ke saath merge karte hain. 
              Hamara mission hai kahaniyon ke zariye dimaag ki simayein todna.
            </p>
          </section>

          {/* The Vision */}
          <section className="vision-card">
            <h2>OUR PROTOCOL (VISION)</h2>
            <p>
              Hum ek aisa universe bana rahe hain jahan har volume ek naya dimension hai. 
              Gyan ki Veda sirf ek kahani nahi, ek neural experience hai jo aapko 
              reality aur fiction ke beech ke farq ko bhulne par majboor kar degi.
            </p>
          </section>

          {/* Why Tokens? */}
          <section className="tech-card">
            <h2>NEURAL ASSET SYSTEM</h2>
            <p>
              Hamara <strong>Gold Token System</strong> isliye hai taaki hum creators aur fans ke beech ek 
              direct bridge bana sakein. Jab aap tokens acquire karte hain, toh aap sirf content nahi kharidte, 
              aap VedaVerse ke ecosystem ke ek <strong>Commander</strong> ban jate hain.
            </p>
          </section>
        </div>

        {/* Brand Philosophy */}
        <div className="quote-box">
          <blockquote>
            "The universe is not made of atoms; it's made of stories. We just decrypt them."
          </blockquote>
          <span className="author">— The Veda Architects</span>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .about-root {
          background: #000;
          color: #fff;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          background-image: radial-gradient(circle at 50% 50%, #111 0%, #000 100%);
        }

        .about-container {
          padding: 150px 10% 80px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 80px;
        }

        .glitch-text {
          font-size: 4rem;
          font-weight: 900;
          color: #ffcc00;
          letter-spacing: -2px;
          text-shadow: 0 0 20px rgba(255, 204, 0, 0.3);
        }

        .subtitle {
          font-family: monospace;
          color: #666;
          letter-spacing: 3px;
          margin-top: 10px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        section {
          background: rgba(10, 10, 10, 0.8);
          border: 1px solid #1a1a1a;
          padding: 40px;
          border-radius: 20px;
          transition: 0.3s;
        }

        section:hover {
          border-color: #ffcc00;
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(255, 204, 0, 0.05);
        }

        .tech-card {
          grid-column: span 2;
        }

        h2 {
          color: #ffcc00;
          font-size: 1.5rem;
          margin-bottom: 20px;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
        }

        p {
          color: #aaa;
          line-height: 1.8;
          font-size: 1.05rem;
        }

        strong {
          color: #fff;
        }

        .quote-box {
          margin-top: 100px;
          text-align: center;
          padding: 60px;
          border-top: 1px solid #1a1a1a;
        }

        blockquote {
          font-size: 1.8rem;
          font-style: italic;
          color: #555;
          max-width: 700px;
          margin: 0 auto;
        }

        .author {
          display: block;
          margin-top: 20px;
          color: #ffcc00;
          font-weight: bold;
          letter-spacing: 2px;
        }

        @media (max-width: 768px) {
          .glitch-text { font-size: 2.5rem; }
          .content-grid { grid-template-columns: 1fr; }
          .tech-card { grid-column: span 1; }
          .about-container { padding-top: 100px; }
        }
      `}</style>
    </div>
  );
}
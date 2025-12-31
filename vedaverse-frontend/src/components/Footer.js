import Link from 'next/link';
import { useRouter } from 'next/router';

const team = [
  {
    name: "Gyanvardhan",
    role: "The Visionary Author",
    desc: "Architect of the VedaVerse and the soul behind the narrative legacy.",
    image: "/images/gyanvardhan.jpg" 
  },
  {
    name: "Jaivardhan",
    role: "The Master Editor",
    desc: "Guardian of continuity and the sharp eye behind every frame.",
    image: "/images/jaivardhan.jpg"
  },
  {
    name: "Harshvardhan",
    role: "Narrative Manager & Handler",
    desc: "The bridge between imagination and execution, managing the saga's pulse.",
    image: "/images/harshvardhan.jpg"
  },
  {
    name: "Rajvardhan",
    role: "Creative Director",
    desc: "The visionary force shaping the visual aesthetics of the VedaVerse.",
    image: "/images/rajvardhan.jpg"
  }
];

export default function Footer() {
  const router = useRouter();
  const isHomePage = router.pathname === "/";

  return (
    <footer style={{
      padding: isHomePage ? '150px 5% 40px' : '40px 5% 40px',
      background: 'linear-gradient(to top, #000 70%, transparent 100%)', // Smooth fade from bottom
      position: 'relative',
      zIndex: 10, // Yeh ladki (Scene3D) ke piche rahega (Scene3D usually z-index 5-10 par hota hai)
      marginTop: '100px'
    }}>
      
      {isHomePage && (
        <div className="creators-hall-wrapper">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 className="hall-title">THE CREATOR’S HALL</h2>
            <p className="hall-subtitle">VARDHANS COMIC STUDIOS LEGACY</p>
            <div className="hall-divider"></div>
          </div>

          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="creator-card">
                <div className="image-container">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="member-photo"
                    onError={(e) => { e.target.style.opacity = '0'; }} 
                  />
                  <div className="photo-placeholder">PHOTO</div>
                </div>
                <h3 className="member-name">{member.name}</h3>
                <h4 className="member-role">{member.role}</h4>
                <p className="member-desc">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- LEGAL LINKS --- */}
      <div className="legal-section">
        <div className="policy-links">
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms & Conditions</Link>
          <Link href="/refund">Refund Policy</Link>
          <Link href="/disclaimer">Disclaimer</Link>
        </div>
        <div className="copyright">
          © 2025 VARDHANS COMIC STUDIOS. ALL RIGHTS RESERVED. | VEDAVERSE DIGITAL GATEWAY
        </div>
      </div>

      <style jsx>{`
        .creators-hall-wrapper {
          position: relative;
          z-index: 15;
        }

        .hall-title {
          color: #ffcc00; 
          font-size: clamp(2rem, 5vw, 3.5rem); 
          font-weight: 900;
          letter-spacing: 5px;
          text-shadow: 0 0 20px rgba(255, 204, 0, 0.4);
          margin-bottom: 10px;
        }

        .hall-subtitle {
          color: #888;
          letter-spacing: 4px;
          font-size: 0.9rem;
          font-family: monospace;
        }

        .hall-divider {
          width: 60px;
          height: 4px;
          background: #ffcc00;
          margin: 20px auto;
        }

        .team-grid {
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
          gap: 30px;
          margin-bottom: 100px;
        }

        .creator-card {
          text-align: center;
          padding: 40px 25px;
          background: rgba(0, 0, 0, 0.7); /* Darker background for visibility */
          border: 1px solid rgba(255, 204, 0, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(10px); /* Makes it stand out from the red background */
          transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .creator-card:hover {
          transform: translateY(-15px);
          border-color: #ffcc00;
          background: rgba(0, 0, 0, 0.9);
          box-shadow: 0 20px 40px rgba(0,0,0,0.8);
        }

        .image-container {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: #111;
          margin: 0 auto 25px;
          border: 3px solid #ffcc00;
          overflow: hidden;
          position: relative;
          box-shadow: 0 0 15px rgba(255, 204, 0, 0.3);
        }

        .member-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(0.2) contrast(1.1); /* Slightly bolder photos */
        }

        .photo-placeholder {
          position: absolute; top: 50%; left: 50%; 
          transform: translate(-50%, -50%); color: #333; 
          font-size: 0.7rem; z-index: -1;
        }

        .member-name {
          color: #fff;
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .member-role {
          color: #00d4ff; 
          font-size: 0.85rem; 
          font-family: monospace;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
          font-weight: 700;
        }

        .member-desc {
          color: #bbb; 
          font-size: 0.95rem; 
          line-height: 1.6;
          font-weight: 400;
        }

        .legal-section {
          text-align: center;
          border-top: 1px solid #222;
          padding-top: 50px;
        }

        .policy-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 30px;
          margin-bottom: 30px;
        }

        .policy-links :global(a) {
          color: #666;
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          transition: 0.3s;
          letter-spacing: 1px;
        }

        .policy-links :global(a:hover) {
          color: #ffcc00;
          text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
        }

        .copyright {
          color: #333;
          font-size: 0.7rem;
          letter-spacing: 2px;
          font-family: monospace;
        }

        @media (max-width: 768px) {
          .team-grid { gap: 20px; }
          .hall-title { font-size: 2.2rem; }
        }
      `}</style>
    </footer>
  );
}
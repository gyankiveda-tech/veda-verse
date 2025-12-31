import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Studios() {
  const creators = [
    { 
      name: "GYANVARDHAN", 
      role: "THE VISIONARY AUTHOR", 
      desc: "The prime architect of the VedaVerse. He doesn't just write stories; he builds entire dimensions from the fragments of imagination.",
      specialty: "LORE & ARCHITECTURE",
      img: "/creators/gyan.jpg",
      id: "SUBJECT-01",
      stats: { Lore: 99, Vision: 95, Design: 88 }
    },
    { 
      name: "JAIVARDHAN", 
      role: "THE MASTER EDITOR", 
      desc: "The silent guardian of continuity. His eyes see the flaws that others miss, ensuring every frame of the saga is absolute perfection.",
      specialty: "PRECISION & CONTINUITY",
      img: "/creators/jai.jpg",
      id: "SUBJECT-02",
      stats: { Logic: 98, Focus: 96, Flow: 92 }
    },
    { 
      name: "HARSHVARDHAN", 
      role: "NARRATIVE MANAGER", 
      desc: "The engine of the studio. He bridges the gap between raw creative energy and flawless execution, keeping the cosmic pulse alive.",
      specialty: "STRATEGY & OPERATIONS",
      img: "/creators/harsh.jpg",
      id: "SUBJECT-03",
      stats: { Strategy: 97, Ops: 94, Speed: 95 }
    },
    { 
      name: "RAJVARDHAN", 
      role: "CO-DIRECTOR", 
      desc: "The creative force that shapes the visual soul of the project. He directs the aesthetic chaos into a unified cinematic experience.",
      specialty: "CREATIVE DIRECTION",
      img: "/creators/raj.jpg",
      id: "SUBJECT-04",
      stats: { Visuals: 98, Aesthetic: 96, Direction: 94 }
    }
  ];

  return (
    <div className="no-select studio-root" style={{ background: '#000', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />
      
      {/* Cinematic Overlays */}
      <div className="scanline"></div>
      <div className="studio-noise"></div>
      <div className="ambient-glow"></div>
      
      {/* Live System Terminal */}
      <div className="system-terminal">
        <p>{">"} VARDHAN_PROTOCOL_INITIATED...</p>
        <p>{">"} NEURAL_LINK: STABLE</p>
        <p>{">"} SOURCE: VEDA_CORE</p>
      </div>

      <main style={{ padding: '180px 5% 100px', position: 'relative', zIndex: 2 }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '120px' }}>
          <h1 className="heavy-text">VARDHANS<br/><span className="gold-text">STUDIOS</span></h1>
          <div className="energy-beam"></div>
          <p className="subtitle">ESTABLISHED FOR GALACTIC DOMINANCE</p>
        </div>

        {/* Creators Grid */}
        <div className="creators-container">
          {creators.map((dev, index) => (
            <div key={index} className="rockstar-card">
              <div className="card-inner">
                <div className="image-area">
                  <img 
                    src={dev.img} 
                    alt={dev.name} 
                    className="creator-img"
                    onError={(e) => { e.target.style.display = 'none'; }} 
                  />
                  <div className="glitch-overlay"></div>
                  <div className="id-tag">{dev.id}</div>
                  <div className="specialty-tag">{dev.specialty}</div>
                  
                  {/* Skill HUD Overlay */}
                  <div className="skill-hud">
                    {Object.entries(dev.stats).map(([label, value]) => (
                      <div key={label} className="hud-stat">
                        <span>{label}</span>
                        <div className="stat-bar"><div className="fill" style={{width: `${value}%`}}></div></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="info-area">
                  <h2 className="creator-name">{dev.name}</h2>
                  <h4 className="creator-role">{dev.role}</h4>
                  <p className="creator-desc">{dev.desc}</p>
                </div>

                <div className="card-footer">
                  <span className="status-dot"></span> BIOMETRIC SCAN: VERIFIED
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Evolution Timeline */}
        <section style={{ marginTop: '180px' }}>
          <div className="section-header" style={{textAlign: 'center', marginBottom: '80px'}}>
            <h2 className="heavy-text" style={{ fontSize: '4.5rem' }}>PROJECT <span className="gold-text">EVOLUTION</span></h2>
            <p style={{color: '#444', letterSpacing: '5px', marginTop: '10px'}}>TEMPORAL_LOGS_v4.0</p>
          </div>
          
          <div className="timeline-container">
            <div className="timeline-item">
              <div className="year">2024</div>
              <div className="content">
                <h3>THE CONCEPT PHASE</h3>
                <p>The Four Pillars united. World-building and cosmic scripting of the VedaVerse began in absolute secrecy.</p>
              </div>
            </div>
            <div className="timeline-item active">
              <div className="year">2025</div>
              <div className="content">
                <h3>GENESIS: PHASE 1</h3>
                <p>Official launch of the VedaVerse ecosystem. Establishing the neural connection with global readers.</p>
              </div>
            </div>
            <div className="timeline-item locked">
              <div className="year">2026</div>
              <div className="content">
                <h3>THE EXPANSION</h3>
                <p>New media integrations and cinematic lore. Data currently protected by Veda-Encryption.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      <style jsx>{`
        .studio-root { --electric-gold: #ffcc00; }
        
        .heavy-text {
          font-size: 7.5rem; font-weight: 900; line-height: 0.8;
          color: #fff; letter-spacing: -4px; margin: 0;
          text-transform: uppercase;
        }
        .gold-text { color: var(--electric-gold); text-shadow: 0 0 30px rgba(255, 204, 0, 0.4); }
        
        .energy-beam { 
          width: 150px; height: 4px; background: #ffcc00; margin: 30px auto; 
          box-shadow: 0 0 20px #ffcc00; position: relative;
        }

        .system-terminal {
          position: fixed; top: 150px; left: 20px; font-family: monospace;
          color: var(--electric-gold); font-size: 0.65rem; opacity: 0.4; z-index: 5;
          pointer-events: none;
        }

        .scanline {
          width: 100%; height: 10px; background: rgba(255, 204, 0, 0.03);
          position: fixed; top: 0; left: 0; z-index: 10;
          animation: scan 8s linear infinite; pointer-events: none;
        }

        @keyframes scan { from { top: -100px; } to { top: 100vh; } }

        .subtitle { letter-spacing: 12px; color: #555; font-weight: bold; font-size: 0.9rem; }

        .studio-noise {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: url('https://www.transparenttextures.com/patterns/stardust.png');
          opacity: 0.15; pointer-events: none; z-index: 1;
        }

        .ambient-glow {
            position: fixed; top: 0; left: 50%; transform: translateX(-50%);
            width: 70vw; height: 70vh; background: radial-gradient(circle, rgba(255, 204, 0, 0.05) 0%, transparent 70%);
            pointer-events: none; z-index: 0;
        }

        .creators-container {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 40px; max-width: 1600px; margin: 0 auto;
        }

        .rockstar-card {
          position: relative; background: #080808; border: 1px solid #111;
          transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .rockstar-card:hover { transform: scale(1.03); border-color: var(--electric-gold); z-index: 10; }

        .image-area { height: 480px; background: #000; position: relative; overflow: hidden; }
        .creator-img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.1); transition: 0.6s; }
        .rockstar-card:hover .creator-img { filter: grayscale(0) contrast(1); transform: scale(1.08); }
        
        .skill-hud {
          position: absolute; top: 20px; left: 20px; width: 120px;
          background: rgba(0,0,0,0.7); padding: 10px; border-left: 2px solid var(--electric-gold);
          opacity: 0; transition: 0.4s; transform: translateX(-20px);
        }
        .rockstar-card:hover .skill-hud { opacity: 1; transform: translateX(0); }
        .hud-stat { font-size: 0.6rem; color: #fff; margin-bottom: 5px; }
        .stat-bar { height: 3px; background: #222; width: 100%; margin-top: 2px; }
        .stat-bar .fill { height: 100%; background: var(--electric-gold); box-shadow: 0 0 5px var(--electric-gold); }

        .glitch-overlay {
            position: absolute; top:0; left:0; width:100%; height:100%;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
            background-size: 100% 2px, 3px 100%; pointer-events: none; opacity: 0.4;
        }

        .id-tag { position: absolute; top: 20px; right: 25px; font-family: monospace; color: #333; font-weight: bold; font-size: 1.5rem; }
        .specialty-tag { position: absolute; bottom: 0; left: 0; background: var(--electric-gold); color: #000; padding: 10px 25px; font-weight: 900; font-size: 0.85rem; clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%); z-index: 5; }

        .info-area { padding: 45px; background: linear-gradient(to bottom, #080808, #000); border-bottom: 1px solid #111; }
        .creator-name { font-size: 2.8rem; font-weight: 900; margin: 0; color: #fff; letter-spacing: -2px; }
        .creator-role { color: var(--electric-gold); margin: 10px 0 25px; font-size: 0.95rem; letter-spacing: 4px; font-weight: bold; text-transform: uppercase; }
        .creator-desc { color: #666; font-size: 1rem; line-height: 1.7; font-weight: 400; }
        
        .card-footer { background: #000; padding: 20px 45px; font-size: 0.75rem; color: #333; display: flex; align-items: center; gap: 12px; font-weight: bold; border-top: 1px solid #111; }
        .status-dot { width: 10px; height: 10px; background: #00ff88; border-radius: 50%; box-shadow: 0 0 15px #00ff88; animation: blink 2s infinite; }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }

        .timeline-container { max-width: 900px; margin: 0 auto; border-left: 1px dashed #222; padding-left: 80px; }
        .timeline-item { position: relative; margin-bottom: 100px; }
        .year { position: absolute; left: -160px; color: #1a1a1a; font-weight: 900; font-size: 3.5rem; transition: 0.4s; }
        .timeline-item.active .year { color: var(--electric-gold); text-shadow: 0 0 25px rgba(255, 204, 0, 0.4); }
        .timeline-item.locked { filter: blur(3px); opacity: 0.2; }
        .content h3 { color: #fff; margin: 0 0 15px; font-size: 2.2rem; letter-spacing: 4px; }
        .content p { color: #444; margin: 0; font-size: 1.2rem; line-height: 1.8; }

        @media (max-width: 1024px) {
            .heavy-text { font-size: 4rem; }
            .creators-container { grid-template-columns: 1fr; }
            .year { position: static; margin-bottom: 10px; display: block; font-size: 2.5rem; }
            .timeline-container { border-left: none; padding-left: 0; text-align: center; }
        }
      `}</style>
    </div>
  );
}
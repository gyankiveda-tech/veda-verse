import { motion } from 'framer-motion';
import Link from 'next/link';

const volumes = [
  { id: 1, title: "The Origin", status: "unlocked", x: 10, y: 20 },
  { id: 2, title: "Obsidian Rising", status: "locked", x: 25, y: 45 },
  { id: 3, title: "Neon Shadow", status: "locked", x: 45, y: 30 },
  { id: 4, title: "The Void", status: "locked", x: 65, y: 55 },
  { id: 5, title: "Galactic Gate", status: "locked", x: 80, y: 20 },
  // Aap baki 5 volumes bhi isi tarah add kar sakte hain...
];

export default function UniverseMap() {
  return (
    <div style={{
      height: '100vh',
      width: '100%',
      background: 'radial-gradient(circle at center, #0a0a15 0%, #050505 100%)',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'grab'
    }}>
      <h2 style={{
        position: 'absolute',
        top: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'var(--electric-gold)',
        zIndex: 10,
        textAlign: 'center'
      }}>
        Phase 1: The Galactic Awakening
      </h2>

      {/* Background Star Particles */}
      <div className="stars-overlay" style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.5 }}></div>

      {volumes.map((vol) => (
        <Link href={`/volume/${vol.id}`} key={vol.id}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: vol.id * 0.2 }}
            whileHover={{ scale: 1.2 }}
            style={{
              position: 'absolute',
              left: `${vol.x}%`,
              top: `${vol.y}%`,
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            {/* The Star (Volume Node) */}
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: vol.status === 'unlocked' ? 'var(--electric-gold)' : '#333',
              boxShadow: vol.status === 'unlocked' ? '0 0 20px var(--electric-gold)' : 'none',
              margin: '0 auto'
            }}></div>
            
            {/* Volume Label */}
            <p style={{
              color: vol.status === 'unlocked' ? '#fff' : '#666',
              fontSize: '0.7rem',
              marginTop: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Vol {vol.id}: {vol.title}
            </p>
          </motion.div>
        </Link>
      ))}

      {/* SVG Connecting Lines (Simplified) */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <line x1="10%" y1="20%" x2="25%" y2="45%" stroke="rgba(255,215,0,0.1)" strokeWidth="1" />
        <line x1="25%" y1="45%" x2="45%" y2="30%" stroke="rgba(255,215,0,0.1)" strokeWidth="1" />
      </svg>
    </div>
  );
}
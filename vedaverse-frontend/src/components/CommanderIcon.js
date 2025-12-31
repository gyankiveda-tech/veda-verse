export default function CommanderIcon({ initial = "C", size = "80px" }) {
  return (
    <div className="icon-container">
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer Glowing Ring */}
        <circle cx="50" cy="50" r="48" stroke="var(--electric-gold)" strokeWidth="1" strokeDasharray="10 5" opacity="0.5" />
        
        {/* Inner Solid Ring */}
        <circle cx="50" cy="50" r="42" stroke="var(--electric-gold)" strokeWidth="2" />
        
        {/* Background Hexagon Shape (Futuristic Feel) */}
        <path d="M50 15L80 32.5V67.5L50 85L20 67.5V32.5L50 15Z" fill="rgba(255, 215, 0, 0.1)" stroke="var(--electric-gold)" strokeWidth="1" />
        
        {/* User Initial Text */}
        <text 
          x="50%" 
          y="50%" 
          dominantBaseline="middle" 
          textAnchor="middle" 
          fill="var(--electric-gold)" 
          fontSize="35" 
          fontWeight="bold" 
          fontFamily="Orbitron, sans-serif"
          style={{ textShadow: '0 0 10px var(--electric-gold)' }}
        >
          {initial}
        </text>
      </svg>

      <style jsx>{`
        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3));
          animation: rotateRing 20s linear infinite;
        }
        @keyframes rotateRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
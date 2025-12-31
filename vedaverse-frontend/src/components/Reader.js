import { useEffect, useRef, useState } from 'react';

export default function Reader({ pages, userEmail }) {
  const canvasRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [watermarkPos, setWatermarkPos] = useState({ x: 10, y: 10 });

  // 1. Security Logic: Disable Right-Click and Shortcuts
  useEffect(() => {
    const disableInteractions = (e) => {
      e.preventDefault();
    };

    const disableShortcuts = (e) => {
      if (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'u' || e.key === 'i')) {
        e.preventDefault();
        alert("Security Protocol: Action Prohibited.");
      }
    };

    document.addEventListener('contextmenu', disableInteractions);
    document.addEventListener('keydown', disableShortcuts);

    return () => {
      document.removeEventListener('contextmenu', disableInteractions);
      document.removeEventListener('keydown', disableShortcuts);
    };
  }, []);

  // 2. Dynamic Watermark: Positions change randomly to prevent screen recording
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({
        x: Math.random() * 80 + '%',
        y: Math.random() * 80 + '%'
      });
    }, 5000); // Har 5 second mein position badlegi
    return () => clearInterval(interval);
  }, []);

  // 3. Canvas Rendering Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = pages[currentPage]; // Encrypted Blob/URL from S3
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  }, [currentPage, pages]);

  return (
    <div style={{ 
      position: 'relative', 
      backgroundColor: '#000', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      userSelect: 'none'
    }}>
      
      {/* Watermark Overlay */}
      <div style={{
        position: 'absolute',
        left: watermarkPos.x,
        top: watermarkPos.y,
        color: 'rgba(255, 255, 255, 0.15)',
        fontSize: '14px',
        pointerEvents: 'none',
        zIndex: 100,
        fontWeight: 'bold',
        textTransform: 'uppercase'
      }}>
        Authorized to: {userEmail}
      </div>

      {/* Main Comic Canvas */}
      <div style={{ 
        boxShadow: '0 0 50px rgba(0,0,0,0.5)', 
        marginTop: '100px',
        position: 'relative',
        border: '1px solid #222'
      }}>
        <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} />
      </div>

      {/* Reader Controls */}
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        display: 'flex', 
        gap: '20px', 
        zIndex: 200 
      }}>
        <button onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} className="btn-gold">Previous</button>
        <span style={{ color: '#fff', alignSelf: 'center' }}>Page {currentPage + 1} of {pages.length}</span>
        <button onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))} className="btn-gold">Next</button>
      </div>

      <style jsx>{`
        canvas {
          filter: brightness(1.1) contrast(1.1); /* Cinematic boost */
        }
      `}</style>
    </div>
  );
}
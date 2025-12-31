import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CinematicHero() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const slides = gsap.utils.toArray('.hero-content');
      
      slides.forEach((slide) => {
        gsap.to(slide, {
          opacity: 0,
          scale: 0.9,
          filter: "blur(10px)",
          scrollTrigger: {
            trigger: slide,
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        });
      });

      // Cinematic Title Entrance
      gsap.fromTo(".main-title", 
        { opacity: 0, y: 50, letterSpacing: "20px" },
        { opacity: 1, y: 0, letterSpacing: "2px", duration: 2, ease: "expo.out", stagger: 0.3 }
      );

    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-wrapper">
      
      {/* SECTION 1: MAIN GATEWAY */}
      <div className="hero-content">
        <div className="status-tag">STATUS: CORE_STABLE</div>
        <h1 className="main-title">VEDAVERSE</h1>
        <div className="divider"></div>
        <p className="agenda-text">BEYOND THE SIMULATION. INTO THE REALITY.</p>
      </div>

      {/* SECTION 2: NEW AGENDA (Replaces The Comic) */}
      <div className="hero-content">
        <div className="status-tag">PROTOCOL: AWAKENING</div>
        <h1 className="main-title">NEURAL_SYNC</h1>
        <div className="divider"></div>
        <p className="agenda-text">UNVEILING THE HIDDEN DIMENSIONS OF TRUTH.</p>
      </div>

      {/* SECTION 3: NEW AGENDA (Replaces The Simulation) */}
      <div className="hero-content">
        <div className="status-tag">SYSTEM: ASCENSION</div>
        <h1 className="main-title">TRUE_REALITY</h1>
        <div className="divider"></div>
        <p className="agenda-text">WHERE THE CODE ENDS, THE JOURNEY BEGINS.</p>
      </div>

      <div className="scroll-indicator">
        <div className="mouse"></div>
      </div>

      <style jsx>{`
        .hero-wrapper {
          position: relative;
          width: 100%;
          /* 3D Model dikhne ke liye background transparent hona zaroori hai */
          background: transparent; 
        }

        .hero-content {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          pointer-events: none;
          background: transparent;
        }

        .status-tag {
          font-family: 'Courier New', monospace;
          color: #ffcc00;
          font-size: 0.75rem;
          letter-spacing: 6px;
          margin-bottom: 10px;
          opacity: 0.8;
        }

        .main-title {
          font-size: clamp(3.5rem, 15vw, 11rem);
          font-weight: 900;
          margin: 0;
          line-height: 1;
          /* TEXT TRANSPARENCY: Piche ka face dikhne ke liye sirf outline */
          color: transparent; 
          -webkit-text-stroke: 1px rgba(255, 255, 255, 1);
          text-transform: uppercase;
        }

        .divider {
          width: 120px;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, #ffcc00, transparent);
          margin: 25px auto;
        }

        .agenda-text {
          font-size: 1rem;
          letter-spacing: 10px;
          color: #ffffff;
          opacity: 0.6;
          text-transform: uppercase;
          max-width: 80%;
        }

        .scroll-indicator {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          opacity: 0.4;
        }

        .mouse {
          width: 22px;
          height: 38px;
          border: 1.5px solid #ffcc00;
          border-radius: 20px;
          position: relative;
        }

        .mouse::before {
          content: '';
          width: 3px;
          height: 8px;
          background: #ffcc00;
          position: absolute;
          left: 50%;
          top: 8px;
          transform: translateX(-50%);
          animation: scrollAnim 2s infinite;
        }

        @keyframes scrollAnim {
          0% { transform: translate(-50%, 0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(-50%, 15px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
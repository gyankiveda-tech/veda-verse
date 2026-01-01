import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CinematicHero() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.innerHeight > window.innerWidth);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    let ctx = gsap.context(() => {
      const slides = gsap.utils.toArray('.hero-content');
      
      slides.forEach((slide) => {
        // 🛠️ FIX: Title, Tag aur Text ko alag se target kiya taaki wo smooth exit karein
        const children = slide.querySelectorAll('.main-title, .status-tag, .divider, .agenda-text');
        
        gsap.to(children, {
          opacity: 0,
          y: isMobile ? -80 : -150, // Movement badha di taaki screen se bahar jaye
          scale: 0.9,
          filter: "blur(10px)",
          stagger: 0.05, // Ek ke baad ek gayab honge, bahut cinematic lagega
          scrollTrigger: {
            trigger: slide,
            start: "top 10%", // Thoda jaldi exit shuru hoga
            end: "bottom 20%", 
            scrub: 1,
          }
        });
      });

      // Entrance Animation (Jab page pehli baar load ho)
      gsap.fromTo(".main-title", 
        { opacity: 0, y: 50, letterSpacing: isMobile ? "8px" : "20px" },
        { opacity: 1, y: 0, letterSpacing: "2px", duration: 1.5, ease: "expo.out", stagger: 0.3 }
      );

    }, containerRef);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', checkMobile);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isMobile]);

  return (
    <div ref={containerRef} className="hero-wrapper">
      
      {/* SECTION 1 */}
      <div className="hero-content first-hero">
        <div className="status-tag">STATUS: CORE_STABLE</div>
        <h1 className="main-title">VEDAVERSE</h1>
        <div className="divider"></div>
        <p className="agenda-text">BEYOND THE SIMULATION. INTO THE REALITY.</p>
      </div>

      {/* SECTION 2 */}
      <div className="hero-content">
        <div className="status-tag">PROTOCOL: AWAKENING</div>
        <h1 className="main-title">VEDAVERSE</h1>
        <div className="divider"></div>
        <p className="agenda-text">UNVEILING THE HIDDEN DIMENSIONS OF TRUTH.</p>
      </div>

      {/* SECTION 3 */}
      <div className="hero-content last-hero">
        <div className="status-tag">SYSTEM: ASCENSION</div>
        <h1 className="main-title">TRUE_REALITY</h1>
        <div className="divider"></div>
        <p className="agenda-text">WHERE THE CODE ENDS, THE JOURNEY BEGINS.</p>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="mouse"></div>
        <div className="scroll-text">SCROLL_TO_AWAKEN</div>
      </div>

      <style jsx>{`
        .hero-wrapper {
          position: relative;
          width: 100%;
          background: transparent;
          z-index: 10; 
          pointer-events: none; 
        }

        .hero-content {
          height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 10%;
          margin-bottom: 50vh; /* Space maintain rakhi hai smooth transition ke liye */
        }

        .last-hero { margin-bottom: 0; }

        .status-tag, .main-title, .divider, .agenda-text {
          will-change: transform, opacity; /* Performance boost */
        }

        .status-tag {
          font-family: monospace;
          color: #ffcc00;
          font-size: 0.7rem;
          letter-spacing: 4px;
          margin-bottom: 10px;
        }

        .main-title {
          font-size: clamp(2.5rem, 12vw, 8rem);
          font-weight: 900;
          line-height: 1.1;
          color: transparent; 
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.8);
        }

        @media only screen and (max-width: 768px) {
          .hero-content {
            height: 100vh; /* Pure screen cover karega */
            margin-bottom: 40vh;
          }
          .main-title {
             -webkit-text-stroke: 1px #ffcc00;
             font-size: 3.2rem;
          }
          .scroll-indicator { display: none; }
        }

        .divider { width: 60px; height: 1px; background: #ffcc00; margin: 15px auto; }
        .agenda-text { font-size: 0.7rem; letter-spacing: 3px; color: #eee; max-width: 80%; }
      `}</style>
    </div>
  );
}

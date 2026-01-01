import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GTASection({ title, subtitle, description, onBtnClick }) {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // --- 1. ENTRANCE ANIMATION (Mobile Friendly) ---
      gsap.fromTo(textRef.current,
        { 
          y: 60, 
          opacity: 0, 
          scale: 1.1,
          filter: "blur(10px)" 
        },
        {
          y: 0, 
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%", 
            end: "top 15%", 
            scrub: 1,
            toggleActions: "play reverse play reverse", 
          }
        }
      );

      // --- 2. EXIT ANIMATION ---
      gsap.to(textRef.current, {
        opacity: 0,
        y: -60,
        scale: 0.9,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom 70%", 
          end: "bottom top",
          scrub: true
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="gta-section-block">
      <div className="section-container">
        <div ref={textRef} className="text-column">
          <div className="content-box">
            <span className="gta-subtitle-label">{subtitle}</span>
            <h2 className="gta-heading-main title-glow">{title}</h2>
            <div className="yellow-divider"></div>
            <p className="gta-desc-text">{description}</p>
            
            <button className="gta-btn" onClick={onBtnClick}>
               {/* PC par purana text, Mobile par professional text */}
               <span className="btn-text-pc">READ DATA_LOG</span>
               <span className="btn-text-mobile">INITIALIZE DATA</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .gta-section-block {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent; 
          overflow: hidden;
          padding: 10vh 5%; 
          position: relative;
          z-index: 10;
          pointer-events: none; 
        }

        .section-container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          text-align: center;
        }

        .text-column {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          will-change: transform, opacity, filter;
        }

        .content-box {
          pointer-events: auto;
          background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.4), transparent);
          padding: 40px;
          border-radius: 30px;
        }

        .gta-subtitle-label {
          font-family: 'JetBrains Mono', monospace;
          color: #ffcc00;
          letter-spacing: 8px;
          text-transform: uppercase;
          font-size: clamp(0.7rem, 1.5vw, 0.9rem);
          display: block;
          margin-bottom: 10px;
          opacity: 0.9;
        }

        .gta-heading-main {
          font-size: clamp(2.2rem, 8vw, 6.5rem);
          font-weight: 900;
          line-height: 0.95;
          margin: 0;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: -2px;
        }

        .title-glow { text-shadow: 0 0 40px rgba(255, 255, 255, 0.15); }

        .yellow-divider {
          width: 80px; height: 3px; background: #ffcc00;
          margin: 25px auto; box-shadow: 0 0 15px rgba(255, 204, 0, 0.6);
        }

        .gta-desc-text {
          font-size: clamp(0.95rem, 2vw, 1.25rem);
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto 30px auto;
        }

        .gta-btn {
          background: #ffcc00; color: #000;
          border: none; padding: 18px 45px;
          font-weight: 900; font-family: 'JetBrains Mono', monospace;
          letter-spacing: 3px; cursor: pointer;
          clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
          transition: 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          font-size: 0.85rem;
        }

        .gta-btn:hover {
          transform: scale(1.05); background: #fff;
          box-shadow: 0 0 30px #ffcc00;
        }

        .btn-text-mobile { display: none; }

        /* --- 📱 MOBILE VERTICAL FIX --- */
        @media (max-width: 900px) {
          .btn-text-pc { display: none; }
          .btn-text-mobile { display: inline; }
          
          .content-box {
            padding: 30px 15px;
            width: 100%;
          }

          .gta-heading-main {
            font-size: 2.8rem;
            letter-spacing: 0;
          }

          .gta-desc-text {
            font-size: 0.9rem;
            width: 90%;
          }
        }

        /* Landscape orientation par bhi vartical alignment force karna */
        @media (max-width: 900px) and (orientation: landscape) {
          .gta-section-block {
             padding: 20px 5%;
             min-height: 120vh; /* Scroll space for vertical text */
          }
          .text-column {
             transform: none !important; /* Force vertical flow */
          }
        }
      `}</style>
    </section>
  );
}

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
      // --- THE FIX: ENTRANCE AND EXIT ANIMATION ---
      gsap.fromTo(textRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0, 
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%", // Jab section 70% screen par aaye tab start ho
            end: "bottom 30%", // Jab bottom 30% par jaye tab fade out ho
            scrub: 1,
            // Ise toggleActions kehte hain: ye ensure karta hai ki purana text gayab ho jaye
            toggleActions: "play reverse play reverse", 
          }
        }
      );

      // Section khud bhi thoda fade ho jaye jab piche jaye
      gsap.to(sectionRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom 20%", 
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
              READ DATA_LOG
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
          padding: 150px 5%; /* Padding badha di taaki gap rahe */
          position: relative;
          z-index: 10;
        }

        .section-container {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          text-align: center;
          pointer-events: auto; /* Buttons click honge */
        }

        .text-column {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          will-change: transform, opacity; /* Performance boost */
        }

        .gta-subtitle-label {
          font-family: monospace;
          color: #ffcc00;
          letter-spacing: 6px;
          text-transform: uppercase;
          font-size: 0.8rem;
          display: block;
          margin-bottom: 10px;
          opacity: 0.8;
        }

        .gta-heading-main {
          font-size: clamp(2.5rem, 8vw, 6rem);
          font-weight: 900;
          line-height: 1;
          margin: 0;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: -2px;
        }

        .title-glow {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
        }

        .yellow-divider {
          width: 80px;
          height: 3px;
          background: #ffcc00;
          margin: 30px auto;
          box-shadow: 0 0 10px #ffcc00;
        }

        .gta-desc-text {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.5;
          max-width: 600px;
          margin: 0 auto 40px auto;
          font-family: 'Space Grotesk', sans-serif;
        }

        .gta-btn {
          background: #ffcc00;
          color: #000;
          border: none;
          padding: 15px 40px;
          font-weight: 900;
          font-family: monospace;
          letter-spacing: 2px;
          cursor: pointer;
          clip-path: polygon(8% 0, 100% 0, 92% 100%, 0 100%);
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .gta-btn:hover {
          background: #fff;
          transform: scale(1.05);
          box-shadow: 0 0 20px #ffcc00;
        }

        @media (max-width: 768px) {
          .gta-section-block { padding: 100px 5%; }
          .gta-heading-main { font-size: 2.2rem; }
          .gta-desc-text { font-size: 1rem; }
        }
      `}</style>
    </section>
  );
}
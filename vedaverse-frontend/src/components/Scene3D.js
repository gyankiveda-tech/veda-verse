import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, PerspectiveCamera, useAnimations, useProgress, Html } from '@react-three/drei';
import { Suspense, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --- LOADER ---
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="loader-container">
        <div className="loader-text">INITIALIZING VEDA_LINK...</div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="percentage">{Math.round(progress)}%</div>
      </div>
      <style jsx>{`
        .loader-container { display: flex; flex-direction: column; align-items: center; width: 300px; }
        .loader-text { color: #ffcc00; font-family: monospace; letter-spacing: 3px; font-size: 0.8rem; margin-bottom: 15px; text-shadow: 0 0 10px #ffcc00; }
        .progress-bar-bg { width: 100%; height: 2px; background: rgba(255, 204, 0, 0.1); position: relative; }
        .progress-bar-fill { height: 100%; background: #ffcc00; transition: width 0.3s ease; box-shadow: 0 0 15px #ffcc00; }
        .percentage { color: #fff; font-family: monospace; font-size: 0.7rem; margin-top: 10px; opacity: 0.6; }
      `}</style>
    </Html>
  );
}

// --- MODEL COMPONENT ---
function Model({ progressValue }) {
  const { scene, animations } = useGLTF('/models/character.glb');
  const modelRef = useRef();
  const { actions, names } = useAnimations(animations, modelRef);

  useEffect(() => {
    if (actions && names.length > 0) {
      actions[names[0]].reset().fadeIn(0.5).play();
    }
  }, [actions, names]);

  useFrame((state, delta) => {
    const baseZoom = 14; 
    const targetZoom = 10; 

    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, THREE.MathUtils.lerp(baseZoom, targetZoom, progressValue), 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, THREE.MathUtils.lerp(0.5, 2.2, progressValue), 0.05);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, THREE.MathUtils.lerp(0, -1.5, progressValue), 0.05);
    state.camera.lookAt(0, 1, 0);

    if (modelRef.current) {
      modelRef.current.position.y = -8.5; 
      const targetRotY = THREE.MathUtils.lerp(Math.PI, Math.PI * 3, progressValue);
      modelRef.current.rotation.y = THREE.MathUtils.damp(modelRef.current.rotation.y, targetRotY, 3, delta);
    }
  });

  return <primitive ref={modelRef} object={scene} scale={3.5} />;
}

export default function Scene3D() {
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const mobileTextRef = useRef(null);
  const hudRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.innerHeight > window.innerWidth);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const trigger = ScrollTrigger.create({
      trigger: ".hero-wrapper",
      start: "top top",
      end: "bottom bottom",
      scrub: 2,
      onUpdate: (self) => setProgress(self.progress),
    });

    let ctx = gsap.context(() => {
      if (isMobile && mobileTextRef.current) {
        gsap.to([mobileTextRef.current, hudRef.current], {
          y: -100,
          opacity: 0,
          scrollTrigger: {
            trigger: ".hero-wrapper",
            start: "top top",
            end: "top -30%",
            scrub: true,
          }
        });
      }
    });

    return () => {
      trigger.kill();
      ctx.revert();
      window.removeEventListener('resize', checkMobile);
    }
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="mobile-interface">
        {/* Futuristic Background Grid */}
        <div className="cyber-grid"></div>

        {/* HUD Elements */}
        <div className="hud-layer" ref={hudRef}>
          <div className="hud-corner top-left">SYS_v2.0.26</div>
          <div className="hud-corner top-right">LOC: 28.61° N</div>
          <div className="hud-corner bottom-left">LINK_STABLE</div>
          <div className="hud-corner bottom-right">SYNC: 98%</div>
          
          <div className="side-bar-left">
            {[...Array(10)].map((_, i) => <div key={i} className="dot"></div>)}
          </div>
          
          <div className="coordinate-stream">
            <div>X: {(progress * 100).toFixed(2)}</div>
            <div>Y: {(Math.random() * 50).toFixed(2)}</div>
            <div>Z: 0.8842</div>
          </div>
        </div>

        <div className="mobile-hero-content" ref={mobileTextRef}>
          <div className="glitch-wrapper">
            <h1 className="mobile-title">VEDAVERSE</h1>
          </div>
          <div className="commander-badge">NEURAL_INTERFACE_ACTIVE</div>
          <p className="mobile-desc">DECRYPTING REALITY. SCROLL TO SYNC.</p>
          <div className="mobile-scanner"></div>
        </div>

        <style jsx>{`
          .mobile-interface { 
            height: 100vh; width: 100%; 
            background: #000;
            display: flex; align-items: center; justify-content: center; 
            position: fixed; top: 0; left: 0; z-index: 10; 
            pointer-events: none;
            overflow: hidden;
          }

          .cyber-grid {
            position: absolute; width: 200%; height: 200%;
            background-image: 
              linear-gradient(rgba(255, 204, 0, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 204, 0, 0.05) 1px, transparent 1px);
            background-size: 40px 40px;
            transform: perspective(500px) rotateX(60deg);
            top: -50%; animation: gridMove 20s infinite linear;
          }

          @keyframes gridMove { 0% { transform: perspective(500px) rotateX(60deg) translateY(0); } 100% { transform: perspective(500px) rotateX(60deg) translateY(40px); } }

          .hud-layer { position: absolute; width: 100%; height: 100%; padding: 30px; }
          .hud-corner { position: absolute; font-family: monospace; color: #ffcc00; font-size: 0.5rem; letter-spacing: 2px; opacity: 0.6; }
          .top-left { top: 40px; left: 20px; border-left: 1px solid #ffcc00; padding-left: 5px; }
          .top-right { top: 40px; right: 20px; border-right: 1px solid #ffcc00; padding-right: 5px; }
          .bottom-left { bottom: 40px; left: 20px; }
          .bottom-right { bottom: 40px; right: 20px; }

          .side-bar-left { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 8px; }
          .dot { width: 3px; height: 3px; background: #ffcc00; border-radius: 50%; opacity: 0.3; animation: blink 2s infinite; }
          @keyframes blink { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.8; } }

          .coordinate-stream { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); font-family: monospace; color: #ffcc00; font-size: 0.5rem; text-align: right; opacity: 0.4; }

          .mobile-hero-content { text-align: center; z-index: 20; will-change: transform, opacity; }
          .mobile-title { font-size: 3.8rem; color: #ffcc00; letter-spacing: 8px; text-shadow: 0 0 30px rgba(255, 204, 0, 0.3); margin-bottom: 5px; font-weight: 900; }
          .commander-badge { display: inline-block; border: 1px solid rgba(255, 204, 0, 0.5); color: #ffcc00; padding: 4px 12px; font-size: 0.55rem; letter-spacing: 3px; margin-bottom: 15px; background: rgba(0,0,0,0.5); }
          .mobile-desc { color: #888; font-size: 0.65rem; letter-spacing: 2px; text-transform: uppercase; }
          
          .mobile-scanner { width: 100%; height: 2px; background: linear-gradient(to right, transparent, #ffcc00, transparent); position: absolute; top: 0; left: 0; animation: scan 3s infinite ease-in-out; opacity: 0.2; }
          @keyframes scan { 0% { top: 10%; } 100% { top: 90%; } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="canvas-wrapper pc-bg">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[0, 0.5, 14]} fov={35} />
        <ambientLight intensity={0.4} /> 
        <pointLight position={[5, 5, 5]} intensity={10} color="#ffcc00" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={8} color="#ffcc00" />
        <Suspense fallback={<Loader />}>
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
            <Model progressValue={progress} />
          </Float>
        </Suspense>
      </Canvas>
      <div className="bg-text-layer">
        <div className="title-container" style={{ opacity: 1 - progress * 1.5 }}>
          <h1 className="main-title">VEDAVERSE</h1>
          <p className="sub-title">SCROLL_TO_FACE_REALITY</p>
        </div>
      </div>
      <style jsx>{`
        .canvas-wrapper { height: 100vh; width: 100%; position: fixed; top: 0; left: 0; z-index: 1; }
        .pc-bg { background: radial-gradient(circle, #3d0000 0%, #000000 100%); }
        .bg-text-layer { position: absolute; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; z-index: -1; }
        .main-title { font-size: clamp(3rem, 15vw, 15rem); color: rgba(255, 204, 0, 0.05); font-weight: 900; letter-spacing: -5px; margin: 0; }
        .sub-title { font-size: 0.7rem; color: #fff; font-family: monospace; background: rgba(255, 204, 0, 0.1); padding: 5px 15px; text-align: center; letter-spacing: 2px; }
      `}</style>
    </div>
  );
}

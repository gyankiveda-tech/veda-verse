import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, PerspectiveCamera, useAnimations, useProgress, Html } from '@react-three/drei';
import { Suspense, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// --- CUSTOM LOADER COMPONENT ---
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

function Model({ scrollProgress }) {
  const { scene, animations } = useGLTF('/models/character.glb');
  const modelRef = useRef();
  const { actions, names } = useAnimations(animations, modelRef);

  useEffect(() => {
    if (actions && names.length > 0) {
      actions[names[0]].reset().fadeIn(0.5).play();
    }
  }, [actions, names]);

  useFrame((state) => {
    const isMobile = window.innerWidth < 768;
    
    // Smooth camera movements
    const baseZoom = isMobile ? 18 : 12; 
    const targetZoom = isMobile ? 8 : 4.2;

    state.camera.position.z = THREE.MathUtils.lerp(baseZoom, targetZoom, scrollProgress);
    state.camera.position.y = THREE.MathUtils.lerp(0.5, 1.2, scrollProgress);
    state.camera.position.x = THREE.MathUtils.lerp(0, 0.2, scrollProgress);

    state.camera.lookAt(0, 0.5, 0);

    if (modelRef.current) {
      modelRef.current.rotation.y = THREE.MathUtils.lerp(Math.PI, 0, scrollProgress);
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={window.innerWidth < 768 ? 3.0 : 3.8} 
      position={[0, -10.5, 0]} 
    />
  );
}

export default function Scene3D() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / (totalHeight || 1);
      setScrollProgress(progress);
    };
    
    // Add event listener for scroll to trigger both 3D and Music
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="canvas-wrapper">
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <PerspectiveCamera makeDefault position={[0, 0.5, 12]} fov={window.innerWidth < 768 ? 45 : 35} />
        
        <ambientLight intensity={0.5} /> 
        <pointLight position={[0, 1.5, 5]} intensity={6} color="#ffffff" />
        <spotLight position={[5, 10, 5]} angle={0.15} penumbra={1} intensity={4} color="#ffcc00" />

        <Suspense fallback={<Loader />}>
          <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.1}>
            <Model scrollProgress={scrollProgress} />
          </Float>
        </Suspense>
      </Canvas>

      <div className="bg-text-layer">
        <div className="title-container" style={{ opacity: 1 - scrollProgress * 1.5 }}>
          <h1 className="main-title">VEDAVERSE</h1>
          <p className="sub-title">SCROLL_TO_FACE_REALITY</p>
        </div>
      </div>

      <style jsx>{`
        .canvas-wrapper {
          height: 100vh;
          width: 100%;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1;
          background: #000; /* Dark Black for cinematic look */
        }
        .bg-text-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: -1;
          pointer-events: none;
        }
        .main-title {
          font-size: clamp(4rem, 15vw, 12rem);
          color: rgba(255, 204, 0, 0.03);
          font-weight: 900;
          letter-spacing: -5px;
          margin: 0;
        }
        .sub-title {
          font-size: 0.7rem;
          color: #fff;
          font-family: monospace;
          background: rgba(255, 204, 0, 0.05);
          border: 1px solid rgba(255, 204, 0, 0.2);
          padding: 8px 25px;
          text-align: center;
          letter-spacing: 4px;
        }
      `}</style>
    </div>
  );
}
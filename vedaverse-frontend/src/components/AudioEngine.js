import { useEffect, useRef } from 'react';

export default function AudioEngine() {
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const pannerRef = useRef(null);
  const gainNodeRef = useRef(null); // Volume booster reference

  useEffect(() => {
    // 1. Web Audio Context Setup
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    audioContextRef.current = context;

    // 2. Audio Instance Setup (Optimized for Streaming)
    const audio = new Audio('/assets/veda-theme.mp3');
    audio.preload = "auto"; 
    audio.loop = true;
    // Base volume 1.0 rakha hai, baaki boost GainNode se hoga
    audio.volume = 1.0; 
    audio.crossOrigin = "anonymous"; 
    
    // START STREAMING: Poori file download hone ka wait mat karo
    audio.load(); 
    audioRef.current = audio;

    // 3. 3D Spatial & Volume Boost Setup
    const source = context.createMediaElementSource(audio);
    const panner = context.createPanner();
    const gainNode = context.createGain(); // --- VOLUME BOOSTER ---
    
    // Volume Level Setting (2.5x Boost)
    // 1.0 normal hota hai, 2.5 kaafi loud aur clear rahega
    gainNode.gain.setValueAtTime(2.5, context.currentTime); 
    gainNodeRef.current = gainNode;

    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    pannerRef.current = panner;

    // Chain: Source -> Panner -> Gain (Booster) -> Destination
    source.connect(panner);
    panner.connect(gainNode);
    gainNode.connect(context.destination);

    // 4. AUTOMATIC 3D MOVEMENT
    let angle = 0;
    const animate3DSound = () => {
      if (pannerRef.current && context.state === 'running') {
        const x = Math.sin(angle) * 5; 
        const z = Math.cos(angle) * 2; 
        pannerRef.current.positionX.setValueAtTime(x, context.currentTime);
        pannerRef.current.positionZ.setValueAtTime(z, context.currentTime);
        angle += 0.005;
      }
      requestAnimationFrame(animate3DSound);
    };
    animate3DSound();

    // 5. START AUDIO (Multi-Trigger Speed)
    const startAudio = async () => {
      try {
        if (context.state === 'suspended') {
          await context.resume();
        }
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Music Boosted & Playing!");
              // Remove events for performance
              window.removeEventListener('click', startAudio);
              window.removeEventListener('touchstart', startAudio);
              window.removeEventListener('scroll', startAudio);
            })
            .catch(error => console.log("Waiting for user interaction..."));
        }
      } catch (err) {
        console.error("Audio Engine Error:", err);
      }
    };

    window.addEventListener('click', startAudio);
    window.addEventListener('touchstart', startAudio); 
    window.addEventListener('scroll', startAudio, { once: true });

    return () => {
      window.removeEventListener('scroll', startAudio);
      window.removeEventListener('click', startAudio);
      window.removeEventListener('touchstart', startAudio);
      audio.pause();
      if (context.state !== 'closed') {
        context.close();
      }
      audioRef.current = null;
    };
  }, []);

  return null; 
}
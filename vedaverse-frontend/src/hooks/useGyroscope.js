import { useEffect } from 'react';

const useGyroscope = (onShake, threshold = 15) => {
  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    let lastUpdate = 0;

    const handleMotion = (event) => {
      const current = new Date().getTime();
      // Har 100ms mein ek baar check karega (Performance ke liye)
      if ((current - lastUpdate) > 100) {
        const diffTime = current - lastUpdate;
        lastUpdate = current;

        const { x, y, z } = event.accelerationIncludingGravity || {};

        if (x !== null && y !== null) {
          // Movement calculation logic
          const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;

          // Agar speed threshold se zyada hai toh onShake trigger hoga
          if (speed > (threshold * 100)) { 
            onShake(); 
          }

          lastX = x;
          lastY = y;
          lastZ = z;
        }
      }
    };

    // Browsers (khaas kar iOS) mein permission maangni padti hai
    const requestPermission = async () => {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        try {
          const response = await DeviceMotionEvent.requestPermission();
          if (response === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
          }
        } catch (error) {
          console.error("Gyroscope permission denied", error);
        }
      } else {
        // Android aur non-iOS browsers ke liye direct listen
        window.addEventListener('devicemotion', handleMotion);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [onShake, threshold]);
};

export default useGyroscope;
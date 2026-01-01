import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, googleProvider } from '../lib/firebase'; 
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  setPersistence, 
  browserLocalPersistence 
} from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true); 
  const [authAction, setAuthAction] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && !authAction) {
        router.push('/vault');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router, authAction]);

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try { 
      setAuthAction(true);
      setLoading(true);
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, googleProvider);
      
      // ✅ Tip: Google login ke baad backend ko inform karna zaroori hai (Optional but good)
      router.push('/vault');
    } 
    catch (error) { 
      setLoading(false);
      setAuthAction(false);
      if (error.code !== 'auth/popup-closed-by-user') {
        alert("Verification Failed: " + error.message); 
      }
    }
  };

  // Handle Commander (Email) Login
  const handleCommanderLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthAction(true);

    try { 
      // 1. Firebase Login
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);

      // 2. ✅ OPTIONAL: Backend Database Check (Agar aapne backend mein login route banaya hai)
      // const res = await fetch('https://veda-verse-g71v.onrender.com/api/auth/login', { ... });

      router.push('/vault');
    } 
    catch (error) { 
      setLoading(false);
      setAuthAction(false);
      alert("Invalid Credentials, Commander. Access Denied."); 
    }
  };

  if (loading) {
    return (
      <div style={{ background: '#000', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: 'var(--electric-gold)', letterSpacing: '2px', marginBottom: '10px' }}>INITIALIZING NEURAL LINK...</h2>
        <div className="loader-bar"></div>
        <style jsx>{`
            .loader-bar { width: 200px; height: 2px; background: rgba(255, 215, 0, 0.1); position: relative; overflow: hidden; }
            .loader-bar::after { content: ''; position: absolute; left: -100%; width: 100%; height: 100%; background: var(--electric-gold); animation: load 1.5s infinite; }
            @keyframes load { 100% { left: 100%; } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="no-select" style={{ background: '#000', minHeight: '100vh' }}>
      <Navbar />
      <div className="portal-bg"></div>

      <main style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <div className="login-frame">
          <div className="scanner-line"></div>

          <div className="auth-view">
            <h2 style={{ color: 'var(--electric-gold)', letterSpacing: '5px' }}>ACCESS PORTAL</h2>
            <p style={{ color: 'var(--neon-blue)', fontSize: '0.7rem', marginBottom: '30px' }}>IDENTITY VERIFICATION REQUIRED</p>

            <form onSubmit={handleCommanderLogin}>
              <input type="email" placeholder="COMMANDER EMAIL..." className="portal-input" onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="SECRET PASSCODE..." className="portal-input" onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className="portal-btn">GRANT ACCESS</button>
            </form>

            <div style={{ margin: '20px 0', color: '#444', fontSize: '0.8rem' }}>— OR CONNECT VIA —</div>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button className="social-btn google" onClick={handleGoogleLogin} title="Login with Google">G</button>
            </div>
            <p style={{ marginTop: '25px', fontSize: '0.7rem', color: '#666' }}>
              NEW COMMANDER? <span onClick={() => router.push('/register')} style={{ color: 'var(--electric-gold)', cursor: 'pointer', textDecoration: 'underline' }}>REGISTER HERE</span>
            </p>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .portal-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at center, #001a33 0%, #000 100%); opacity: 0.6; }
        .login-frame { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 215, 0, 0.2); padding: 40px; border-radius: 20px; backdrop-filter: blur(15px); width: 360px; text-align: center; position: relative; overflow: hidden; box-shadow: 0 0 40px rgba(0,0,0,0.5); }
        .scanner-line { position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: var(--electric-gold); animation: scan 3s infinite linear; }
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        .portal-input { width: 100%; background: #000; border: 1px solid #222; padding: 12px; color: var(--electric-gold); margin-bottom: 15px; outline: none; border-radius: 4px; transition: 0.3s; }
        .portal-input:focus { border-color: var(--electric-gold); box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); }
        .portal-btn { width: 100%; background: var(--electric-gold); color: #000; border: none; padding: 12px; font-weight: bold; cursor: pointer; letter-spacing: 2px; border-radius: 4px; transition: 0.3s; }
        .portal-btn:hover { background: #fff; transform: scale(1.02); }
        .social-btn { width: 50px; height: 50px; border-radius: 50%; border: 1px solid #333; background: transparent; color: white; cursor: pointer; font-size: 1.2rem; transition: 0.3s; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .social-btn:hover { border-color: var(--electric-gold); box-shadow: 0 0 15px var(--electric-gold); transform: rotate(360deg); }
      `}</style>
    </div>
  );
}

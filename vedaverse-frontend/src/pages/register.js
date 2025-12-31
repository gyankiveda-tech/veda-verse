import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, googleProvider } from '../lib/firebase'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Agar user pehle se login hai, toh use registration ki zaroorat nahi, seedha Vault bhejo
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/vault');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // --- Email & Password Se Registration ---
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // User ka Display Name update karna
      await updateProfile(userCredential.user, {
        displayName: name
      });
      alert("Commander Registered Successfully!");
      router.push('/vault');
    } catch (error) {
      alert("Registration Failed: " + error.message);
    }
  };

  // --- Google Se Quick Registration ---
  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/vault');
    } catch (error) {
      alert("Google Sign-up Failed.");
    }
  };

  if (loading) return <div style={{background:'#000', height:'100vh'}}></div>;

  return (
    <div className="no-select" style={{ background: '#000', minHeight: '100vh' }}>
      <Navbar />
      <div className="portal-bg"></div>

      <main style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <div className="register-frame">
          <div className="scanner-line"></div>
          
          <div className="auth-view">
            <h2 style={{ color: 'var(--electric-gold)', letterSpacing: '5px' }}>NEW COMMANDER</h2>
            <p style={{ color: 'var(--neon-blue)', fontSize: '0.7rem', marginBottom: '30px' }}>CREATE YOUR NEURAL IDENTITY</p>

            <form onSubmit={handleRegister}>
              <input 
                type="text" 
                placeholder="FULL NAME..." 
                className="portal-input" 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS..." 
                className="portal-input" 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <input 
                type="password" 
                placeholder="CHOOSE PASSCODE..." 
                className="portal-input" 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button type="submit" className="portal-btn">INITIALIZE ACCOUNT</button>
            </form>

            <div style={{ margin: '20px 0', color: '#444', fontSize: '0.8rem' }}>— QUICK LINK —</div>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button className="social-btn google" onClick={handleGoogleSignUp}>G</button>
            </div>

            <p style={{ marginTop: '25px', fontSize: '0.7rem', color: '#666' }}>
              ALREADY A COMMANDER? <span onClick={() => router.push('/login')} style={{ color: 'var(--electric-gold)', cursor: 'pointer', textDecoration: 'underline' }}>LOGIN HERE</span>
            </p>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .portal-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at center, #001a33 0%, #000 100%); opacity: 0.6; }
        .register-frame { 
          background: rgba(255, 255, 255, 0.02); 
          border: 1px solid rgba(255, 215, 0, 0.2); 
          padding: 40px; 
          border-radius: 20px; 
          backdrop-filter: blur(15px); 
          width: 360px; 
          text-align: center; 
          position: relative; 
          overflow: hidden; 
          box-shadow: 0 0 40px rgba(0,0,0,0.5); 
        }
        .scanner-line { position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: var(--electric-gold); animation: scan 3s infinite linear; }
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        
        .portal-input { width: 100%; background: #000; border: 1px solid #222; padding: 12px; color: var(--electric-gold); margin-bottom: 15px; outline: none; border-radius: 4px; }
        .portal-btn { width: 100%; background: var(--electric-gold); color: #000; border: none; padding: 12px; font-weight: bold; cursor: pointer; letter-spacing: 2px; border-radius: 4px; transition: 0.3s; }
        .portal-btn:hover { box-shadow: 0 0 15px var(--electric-gold); }
        
        .social-btn { width: 50px; height: 50px; border-radius: 50%; border: 1px solid #333; background: transparent; color: white; cursor: pointer; font-size: 1.2rem; transition: 0.3s; }
        .social-btn:hover { border-color: var(--electric-gold); box-shadow: 0 0 10px var(--electric-gold); }
      `}</style>
    </div>
  );
}
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';

export default function Contact() {
  // 1. Data capture karne ke liye states
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(''); // Status message dikhane ke liye

  // 2. Form submit karne ka function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('TRANSMITTING...');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('MESSAGE_SENT_SUCCESSFULLY');
        setFormData({ name: '', email: '', message: '' }); // Form clear kar do
      } else {
        setStatus('TRANSMISSION_ERROR');
      }
    } catch (error) {
      console.error(error);
      setStatus('CONNECTION_FAILED');
    }
    
    // 3 seconds baad status reset kar do
    setTimeout(() => setStatus(''), 5000);
  };

  return (
    <div className="contact-root">
      <Navbar />

      <main className="contact-container">
        <section className="contact-hero">
          <h1 className="glow-text">COMMUNICATION_LINK</h1>
          <p className="subtitle">HAVE AN ISSUE WITH THE SIMULATION? CONNECT WITH US.</p>
        </section>

        <div className="contact-grid">
          {/* Support Info */}
          <div className="info-panel">
            <div className="info-item">
              <span className="label">OFFICIAL_EMAIL</span>
              <p className="value">financehubstudio@gmail.com</p>
            </div>
            
            <div className="info-item">
              <span className="label">COMM_LINK (PHONE)</span>
              <p className="value">+91 8521077293</p>
            </div>

            <div className="info-item">
              <span className="label">AVAILABILITY</span>
              <p className="value">10:00 AM - 06:00 PM (IST)</p>
            </div>

            <div className="neural-alert">
              <p>Note: For payment related issues, please mention your <strong>Transaction ID</strong> in the email.</p>
            </div>
          </div>

          {/* Contact Form - Ab ye working hai */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>NODE_NAME</label>
              <input 
                type="text" 
                placeholder="Enter your name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="input-group">
              <label>SECURE_EMAIL</label>
              <input 
                type="email" 
                placeholder="Your email address" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="input-group">
              <label>MESSAGE_PAYLOAD</label>
              <textarea 
                rows="5" 
                placeholder="Describe your query..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              {status || 'TRANSMIT_MESSAGE'}
            </button>

            {/* Status Indicator */}
            {status && (
              <p style={{ 
                fontSize: '0.7rem', 
                color: status.includes('ERROR') ? '#ff4757' : '#00ff88', 
                textAlign: 'center',
                fontFamily: 'monospace' 
              }}>
                {status}
              </p>
            )}
          </form>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .contact-root { background: #000; color: #fff; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .contact-container { padding: 150px 10% 80px; max-width: 1100px; margin: 0 auto; }
        
        .contact-hero { text-align: center; margin-bottom: 60px; }
        .glow-text { font-size: 3rem; font-weight: 900; color: #ffcc00; text-shadow: 0 0 20px rgba(255, 204, 0, 0.3); }
        .subtitle { color: #666; font-family: monospace; letter-spacing: 2px; }

        .contact-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 50px; }

        .info-panel { background: #080808; padding: 40px; border-radius: 20px; border-left: 4px solid #ffcc00; }
        .info-item { margin-bottom: 30px; }
        .label { display: block; font-size: 0.7rem; color: #444; font-family: monospace; letter-spacing: 2px; }
        .value { font-size: 1.1rem; color: #fff; margin-top: 5px; font-weight: bold; }

        .neural-alert { background: rgba(255, 204, 0, 0.05); border: 1px dashed #ffcc0055; padding: 15px; border-radius: 10px; font-size: 0.85rem; color: #aaa; }

        .contact-form { display: flex; flex-direction: column; gap: 20px; }
        .input-group label { display: block; font-size: 0.7rem; color: #ffcc00; margin-bottom: 8px; font-family: monospace; }
        .input-group input, .input-group textarea {
          width: 100%; background: #0a0a0a; border: 1px solid #222; padding: 15px; border-radius: 8px;
          color: #fff; transition: 0.3s;
        }
        .input-group input:focus, .input-group textarea:focus { border-color: #ffcc00; outline: none; background: #111; }

        .submit-btn {
          background: #ffcc00; color: #000; border: none; padding: 15px; border-radius: 8px;
          font-weight: 900; cursor: pointer; transition: 0.3s; letter-spacing: 2px;
        }
        .submit-btn:hover { box-shadow: 0 0 20px rgba(255, 204, 0, 0.4); transform: translateY(-2px); }

        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; }
          .contact-container { padding-top: 100px; }
        }
      `}</style>
    </div>
  );
}
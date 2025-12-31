import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('veda_cookie_consent');
    if (!consent) setShow(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('veda_cookie_consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookie-box">
      <p>BY ENTERING THE VAULT, YOU AGREE TO OUR NEURAL COOKIE PROTOCOLS. 🍪</p>
      <button onClick={acceptCookies}>ACCEPT_SYNC</button>
      <style jsx>{`
        .cookie-box {
          position: fixed; bottom: 20px; right: 20px;
          background: rgba(10, 10, 10, 0.9);
          border: 1px solid #ffcc00; padding: 20px;
          z-index: 10000; border-radius: 12px;
          backdrop-filter: blur(10px); width: 300px;
        }
        p { font-size: 0.7rem; color: #fff; margin-bottom: 10px; font-family: monospace; }
        button { background: #ffcc00; border: none; padding: 8px 15px; font-weight: 900; cursor: pointer; font-size: 0.7rem; }
      `}</style>
    </div>
  );
}
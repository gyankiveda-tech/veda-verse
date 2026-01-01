import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function VerifyOTP() {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Registration ke waqt jo email save kiya tha use uthana
        const savedEmail = localStorage.getItem('tempEmail');
        if (!savedEmail) {
            router.push('/register'); // Agar email nahi mila toh wapas register par bhejo
        } else {
            setEmail(savedEmail);
        }
    }, [router]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // ✅ FIX: Removed double slash from the URL
            const res = await fetch('https://veda-verse-g71v.onrender.com/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            const data = await res.json();

            if (res.ok) {
                alert("NEURAL IDENTITY VERIFIED. WELCOME COMMANDER.");
                localStorage.removeItem('tempEmail'); // Verification ke baad email saaf kar do
                router.push('/login');
            } else {
                setError(data.msg || "INVALID CODE DETECTED.");
            }
        } catch (err) {
            setError("CONNECTION INTERRUPTED. CHECK YOUR NEURAL LINK.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verify-container">
            <Head>
                <title>VedaVerse | Neural Verification</title>
            </Head>

            <div className="cyber-box">
                <h2 className="glitch-text">COMMANDER VERIFICATION</h2>
                <p className="subtitle">Enter the 6-digit access key sent to: <br/> <span>{email}</span></p>

                <form onSubmit={handleVerify}>
                    <div className="input-group">
                        <input 
                            type="text" 
                            maxLength="6"
                            placeholder="X-X-X-X-X-X" 
                            value={otp} 
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                            required
                        />
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button type="submit" disabled={loading} className="verify-btn">
                        {loading ? "VERIFYING..." : "INITIALIZE ACCESS"}
                    </button>
                </form>

                <div className="actions">
                    <button onClick={() => router.push('/register')} className="back-link">
                        WRONG EMAIL? GO BACK
                    </button>
                </div>
            </div>

            <style jsx>{`
                .verify-container {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #000;
                    color: #fff;
                }
                .cyber-box {
                    background: rgba(10, 10, 10, 0.9);
                    padding: 40px;
                    border: 1px solid #ffcc00;
                    box-shadow: 0 0 20px rgba(255, 204, 0, 0.3);
                    text-align: center;
                    max-width: 400px;
                    width: 90%;
                }
                .glitch-text { color: #ffcc00; letter-spacing: 3px; font-size: 1.5rem; }
                .subtitle { font-size: 0.8rem; color: #888; margin-bottom: 25px; }
                .subtitle span { color: #fff; }
                .input-group input {
                    width: 100%;
                    background: transparent;
                    border: none;
                    border-bottom: 2px solid #333;
                    color: #ffcc00;
                    font-size: 2rem;
                    text-align: center;
                    letter-spacing: 10px;
                    outline: none;
                    margin-bottom: 20px;
                }
                .input-group input:focus { border-bottom-color: #ffcc00; }
                .verify-btn {
                    width: 100%;
                    padding: 12px;
                    background: #ffcc00;
                    color: #000;
                    border: none;
                    font-weight: bold;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .verify-btn:hover { background: #fff; box-shadow: 0 0 15px #fff; }
                .error-msg { color: #ff4444; font-size: 0.8rem; margin: 10px 0; }
                .back-link {
                    background: none; border: none; color: #555; font-size: 0.7rem;
                    margin-top: 20px; cursor: pointer; text-decoration: underline;
                }
            `}</style>
        </div>
    );
}

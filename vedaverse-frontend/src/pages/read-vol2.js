import { useEffect, useState, useRef } from 'react'; // useRef add kiya
import { useRouter } from 'next/router';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
    doc, getDoc, collection, addDoc, query, orderBy, 
    onSnapshot, serverTimestamp, updateDoc, increment, setDoc 
} from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ReadVol2() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [comment, setComment] = useState('');
    const [allComments, setAllComments] = useState([]);
    const [stats, setStats] = useState({ likes: 0, dislikes: 0 });
    const [userAction, setUserAction] = useState(null); 
    const [showHeart, setShowHeart] = useState(false);

    const totalPages = 46; 

    // --- SOUND LOGIC ---
    const clickAudio = useRef(null);

    useEffect(() => {
        clickAudio.current = new Audio('/sounds/click.mp3');
    }, []);

    const playClick = () => {
        if (clickAudio.current) {
            clickAudio.current.currentTime = 0; // Reset for fast clicks
            clickAudio.current.play().catch(e => console.log("Sound play blocked"));
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                router.push('/login');
            } else {
                setUser(currentUser);
                const userRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userRef);
                
                if (userSnap.exists() && userSnap.data().unlocked_volumes?.includes(2)) {
                    setIsAuthorized(true);
                } else {
                    router.push('/vault');
                }
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        if (!db || !user || !isAuthorized) return;

        const unsubComments = onSnapshot(query(collection(db, "vol2_comments"), orderBy("createdAt", "desc")), (snap) => {
            setAllComments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const unsubStats = onSnapshot(doc(db, "vol2_data", "stats"), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setStats({
                    likes: Math.max(0, data.likes || 0),
                    dislikes: Math.max(0, data.dislikes || 0)
                });
            }
        });

        const unsubUserAction = onSnapshot(doc(db, "vol2_user_actions", user.uid), (docSnap) => {
            if (docSnap.exists()) setUserAction(docSnap.data().action);
            else setUserAction(null);
        });

        return () => { unsubComments(); unsubStats(); unsubUserAction(); };
    }, [user, isAuthorized]);

    const handleInteraction = async (newAction) => {
        if (!user) return;
        
        playClick(); // Click sound add kiya

        const statsRef = doc(db, "vol2_data", "stats");
        const userActionRef = doc(db, "vol2_user_actions", user.uid);

        let updates = {};

        if (userAction === newAction) {
            updates[newAction === 'liked' ? 'likes' : 'dislikes'] = increment(-1);
            
            try {
                await updateDoc(statsRef, updates);
                await setDoc(userActionRef, { action: null });
                setUserAction(null);
            } catch (e) { console.error("Toggle Error:", e); }
            return;
        }

        const statsSnap = await getDoc(statsRef);
        if (!statsSnap.exists()) {
            await setDoc(statsRef, { likes: 0, dislikes: 0 });
        }

        if (newAction === 'liked') {
            updates.likes = increment(1);
            if (userAction === 'disliked') updates.dislikes = increment(-1);
        } else if (newAction === 'disliked') {
            updates.dislikes = increment(1);
            if (userAction === 'liked') updates.likes = increment(-1);
        }

        try {
            await updateDoc(statsRef, updates);
            await setDoc(userActionRef, { action: newAction });
            setUserAction(newAction);

            if (newAction === 'liked') {
                setShowHeart(true);
                setTimeout(() => setShowHeart(false), 1500);
            }
        } catch (error) {
            console.error("Interaction Error:", error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        
        playClick(); // Click sound add kiya

        await addDoc(collection(db, "vol2_comments"), {
            text: comment,
            userName: user.displayName || "Commander",
            userId: user.uid,
            createdAt: serverTimestamp(),
        });
        setComment('');
    };

    if (loading) return <div className="loader">DECRYPTING_FILES...</div>;
    if (!isAuthorized) return null;

    return (
        <div className="read-page">
            <Navbar />
            {showHeart && <div className="heart-explosion">❤️</div>}
            
            <div className="comic-container">
                <header className="comic-header">
                    <h1>THE FIRST STIR IN REALITY</h1>
                    <p>PART 2: THE AWAKENING</p>
                </header>

                <div className="social-actions">
                    <button 
                        onClick={() => handleInteraction('liked')} 
                        className={`action-btn ${userAction === 'liked' ? 'active-like' : ''}`}
                    >
                        <span className="icon">👍</span> {stats.likes}
                    </button>
                    <button 
                        onClick={() => handleInteraction('disliked')} 
                        className={`action-btn ${userAction === 'disliked' ? 'active-dislike' : ''}`}
                    >
                        <span className="icon">👎</span> {stats.dislikes}
                    </button>
                    <button className="action-btn share" onClick={() => { playClick(); navigator.clipboard.writeText(window.location.href); alert("Signal Copied!"); }}>
                        <span className="icon">🚀</span> SHARE
                    </button>
                </div>

                <div className="divider"></div>

                <div className="image-frame">
                    <img src={`/comics/vol2/${currentPage}.jpg`} alt={`Page ${currentPage}`} className="main-img" />
                </div>

                <div className="transmission-section">
                    <h3>{allComments.length} TRANSMISSIONS</h3>
                    <form onSubmit={handleComment} className="input-group">
                        <input type="text" placeholder="Enter transmission signal..." value={comment} onChange={(e) => setComment(e.target.value)} />
                        <button type="submit" className="post-btn">POST</button>
                    </form>
                    <div className="comments-list" style={{ marginTop: '30px' }}>
                        {allComments.map(c => (
                            <div key={c.id} className="comment-card">
                                <strong>{c.userName}</strong>
                                <p>{c.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sticky-nav">
                    <button onClick={() => { if(currentPage > 1) { playClick(); setCurrentPage(currentPage - 1); } }} className="nav-btn">PREV</button>
                    <span className="page-info">{currentPage} / {totalPages}</span>
                    <button onClick={() => { if(currentPage < totalPages) { playClick(); setCurrentPage(currentPage + 1); } }} className="nav-btn">NEXT</button>
                </div>
            </div>
            <Footer />
            <style jsx>{`
                .read-page { background: #000; min-height: 100vh; color: #fff; }
                .comic-container { max-width: 900px; margin: 0 auto; padding: 120px 20px 150px; text-align: center; }
                .comic-header h1 { color: #ffcc00; font-size: 2.5rem; }
                .social-actions { display: flex; justify-content: center; gap: 15px; margin: 30px 0; }
                .action-btn { background: #111; border: 1px solid #222; color: #fff; padding: 10px 20px; border-radius: 6px; cursor: pointer; transition: 0.3s; }
                .active-like { border-color: #ffcc00 !important; color: #ffcc00 !important; background: rgba(255, 204, 0, 0.1) !important; }
                .active-dislike { border-color: #ff4757 !important; color: #ff4757 !important; background: rgba(255, 71, 87, 0.1) !important; }
                .divider { height: 1px; background: #1a1a1a; margin: 40px 0; }
                .image-frame { width: 100%; background: #050505; border: 1px solid #111; }
                .main-img { width: 100%; height: auto; }
                .transmission-section { text-align: left; margin-top: 50px; }
                .input-group { display: flex; gap: 10px; }
                .input-group input { flex: 1; background: #0a0a0a; border: 1px solid #1a1a1a; padding: 15px; color: #fff; }
                .post-btn { background: #ffcc00; color: #000; border: none; padding: 0 30px; font-weight: bold; cursor: pointer; }
                .comment-card { background: #050505; padding: 15px; border-bottom: 1px solid #111; margin-bottom: 10px; }
                .comment-card strong { color: #ffcc00; display: block; margin-bottom: 5px; }
                .sticky-nav { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: #000; border: 1px solid #ffcc00; padding: 10px 25px; border-radius: 50px; display: flex; align-items: center; gap: 20px; z-index: 1000; }
                .nav-btn { background: #ffcc00; border: none; padding: 8px 15px; border-radius: 20px; font-weight: bold; cursor: pointer; color: #000; }
                .heart-explosion { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 5rem; z-index: 2000; animation: heart-out 1.5s forwards; pointer-events: none; }
                @keyframes heart-out { 0% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 100% { opacity: 0; transform: translate(-50%, -150%) scale(2); } }
                .loader { height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; color: #ffcc00; font-family: monospace; }
            `}</style>
        </div>
    );
}
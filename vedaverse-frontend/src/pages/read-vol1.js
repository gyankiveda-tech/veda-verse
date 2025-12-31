import { useState, useEffect, useRef } from 'react'; // useRef add kiya
import { useRouter } from 'next/router';
import { auth, db } from '../lib/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, addDoc, query, orderBy, onSnapshot, 
  serverTimestamp, doc, updateDoc, increment, setDoc, getDoc 
} from 'firebase/firestore';
import Navbar from '../components/Navbar';

export default function ReadVol1() {
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);
  const [stats, setStats] = useState({ likes: 0, dislikes: 0 });
  const [userAction, setUserAction] = useState(null); 
  const [showHeart, setShowHeart] = useState(false);
  
  const totalPages = 28; 
  const router = useRouter();

  // --- BULLETPROOF SOUND LOGIC ---
  const clickAudio = useRef(null);

  useEffect(() => {
    // Audio object ko pehle hi load kar lo
    clickAudio.current = new Audio('/sounds/click.mp3');
  }, []);

  const playClick = () => {
    if (clickAudio.current) {
      clickAudio.current.currentTime = 0; // Har click par sound reset hoga (Fast clicking support)
      clickAudio.current.play().catch(e => console.log("Sound blocked by browser policy"));
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push('/login');
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!db || !user) return;

    const unsubComments = onSnapshot(query(collection(db, "vol1_comments"), orderBy("createdAt", "desc")), (snap) => {
      setAllComments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubStats = onSnapshot(doc(db, "vol1_data", "stats"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStats({
          likes: Math.max(0, data.likes || 0),
          dislikes: Math.max(0, data.dislikes || 0)
        });
      }
    });

    const unsubUserAction = onSnapshot(doc(db, "vol1_user_actions", user.uid), (docSnap) => {
      if (docSnap.exists()) setUserAction(docSnap.data().action);
      else setUserAction(null);
    });

    return () => { unsubComments(); unsubStats(); unsubUserAction(); };
  }, [user]);

  const handleInteraction = async (newAction) => {
    if (!user) return;
    
    playClick(); // Click sound yahan trigger ho raha hai

    const statsRef = doc(db, "vol1_data", "stats");
    const userActionRef = doc(db, "vol1_user_actions", user.uid);
    const prevStats = { ...stats };
    const prevAction = userAction;

    let updates = {};

    if (userAction === newAction) {
      updates[newAction === 'liked' ? 'likes' : 'dislikes'] = increment(-1);
      setStats(prev => ({ ...prev, [newAction === 'liked' ? 'likes' : 'dislikes']: prev[newAction === 'liked' ? 'likes' : 'dislikes'] - 1 }));
      setUserAction(null);
      try {
        await updateDoc(statsRef, updates);
        await setDoc(userActionRef, { action: null });
      } catch (e) {
        setStats(prevStats);
        setUserAction(prevAction);
      }
      return;
    }

    if (newAction === 'liked') {
      updates.likes = increment(1);
      setStats(prev => ({ ...prev, likes: prev.likes + 1 }));
      if (userAction === 'disliked') {
        updates.dislikes = increment(-1);
        setStats(prev => ({ ...prev, dislikes: prev.dislikes - 1 }));
      }
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1500);
    } else if (newAction === 'disliked') {
      updates.dislikes = increment(1);
      setStats(prev => ({ ...prev, dislikes: prev.dislikes + 1 }));
      if (userAction === 'liked') {
        updates.likes = increment(-1);
        setStats(prev => ({ ...prev, likes: prev.likes - 1 }));
      }
    }

    setUserAction(newAction);

    try {
      const statsSnap = await getDoc(statsRef);
      if (!statsSnap.exists()) await setDoc(statsRef, { likes: 0, dislikes: 0 });
      await updateDoc(statsRef, updates);
      await setDoc(userActionRef, { action: newAction });
    } catch (error) {
      setStats(prevStats);
      setUserAction(prevAction);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    playClick(); 
    try {
      await addDoc(collection(db, "vol1_comments"), {
        text: comment,
        userName: user.displayName || "Commander",
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      setComment('');
    } catch (error) { console.error(error); }
  };

  if (!user) return <div className="cosmic-bg"></div>;

  return (
    <div className="no-select" style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <Navbar />
      <div className="cosmic-bg"></div>
      
      {showHeart && <div className="heart-explosion">😎</div>}

      <main style={{ paddingTop: '110px', paddingBottom: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <h1 style={{ color: '#ffcc00' }}>GYAN KI VEDA - VOL 1</h1>

        <div className="comic-box" style={{ width: '95%', maxWidth: '650px', border: '1px solid #222', background: '#050505' }}>
          <img 
            src={`/comics/vol1/${currentPage}.jpg`} 
            style={{ width: '100%', display: 'block' }} 
          />
        </div>

        {/* Buttons with Sound */}
        <div style={{ display: 'flex', gap: '15px', margin: '30px 0' }}>
          <button onClick={() => handleInteraction('liked')} className={`inter-btn ${userAction === 'liked' ? 'btn-active-like' : ''}`}>
            👍 {stats.likes}
          </button>
          
          <button onClick={() => handleInteraction('disliked')} className={`inter-btn ${userAction === 'disliked' ? 'btn-active-dislike' : ''}`}>
            👎 {stats.dislikes}
          </button>

          <button className="inter-btn" onClick={() => { playClick(); navigator.clipboard.writeText(window.location.href); alert("Copied!");}}>
            🚀 SHARE
          </button>
        </div>

        <div className="floating-nav">
          <button onClick={() => { playClick(); setCurrentPage(p => Math.max(1, p-1)); }} className="btn-gold-nav">PREV</button>
          <span className="page-indicator">{currentPage} / {totalPages}</span>
          <button onClick={() => { playClick(); setCurrentPage(p => Math.min(totalPages, p+1)); }} className="btn-gold-nav">NEXT</button>
        </div>

        <hr style={{ width: '90%', maxWidth: '650px', borderColor: '#111', margin: '60px 0 40px' }} />

        <section style={{ width: '95%', maxWidth: '650px', paddingBottom: '50px' }}>
          <form onSubmit={handleComment} style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
            <input 
              type="text" 
              placeholder="Post a transmission..." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ flex: 1, background: '#0a0a0a', border: '1px solid #222', padding: '12px', color: '#fff' }}
            />
            <button type="submit" className="btn-post">POST</button>
          </form>

          <div className="comments-list">
            {allComments.map(c => (
              <div key={c.id} className="comment-card" style={{ background: '#050505', padding: '15px', border: '1px solid #111', marginBottom: '10px' }}>
                <strong style={{ color: '#ffcc00' }}>{c.userName}</strong>
                <p style={{ color: '#aaa' }}>{c.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        .inter-btn { background: #111; border: 1px solid #222; color: #fff; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
        .btn-active-like { border-color: #ffcc00; color: #ffcc00; }
        .btn-active-dislike { border-color: #ff4757; color: #ff4757; }
        .floating-nav { position: fixed; bottom: 30px; background: #0a0a0a; padding: 10px 20px; border-radius: 50px; border: 1px solid #ffcc00; display: flex; gap: 20px; align-items: center; left: 50%; transform: translateX(-50%); z-index: 1000; }
        .btn-gold-nav { background: #ffcc00; color: #000; border: none; padding: 5px 15px; border-radius: 20px; font-weight: bold; cursor: pointer; }
        .page-indicator { color: #ffcc00; font-family: monospace; }
        .btn-post { background: #ffcc00; color: #000; padding: 0 20px; border-radius: 5px; font-weight: bold; cursor: pointer; }
        .heart-explosion { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 5rem; z-index: 2000; animation: heart-out 1.5s forwards; }
        @keyframes heart-out { 0% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 100% { opacity: 0; transform: translate(-50%, -150%) scale(2); } }
      `}</style>
    </div>
  );
}
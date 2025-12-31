import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { Heart, MessageSquare, Share2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';

export default function ReaderPage() {
  const router = useRouter();
  const { id } = router.query; // Volume ID yahan se milegi
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(28); // Aap har volume ke liye alag set kar sakte hain
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Logic to load specific volume data
  const volumeData = {
    "1": { title: "VEDA GENESIS", folder: "vol1" },
    "2": { title: "THE FIRST STIR IN REALITY", folder: "vol2" }
  };

  const currentVol = volumeData[id] || volumeData["1"];

  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrev = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  return (
    <div className="reader-wrapper">
      <Navbar />
      
      <div className="reader-header">
        <button className="back-to-vault" onClick={() => router.push('/vault')}>← BACK TO ARCHIVE</button>
        <div className="vol-info">
          <span className="gold-text">READING:</span> {currentVol.title}
        </div>
        <div className="page-indicator">PAGE {currentPage} / {totalPages}</div>
      </div>

      <div className="main-reader-area">
        <button className="side-nav prev" onClick={handlePrev} disabled={currentPage === 1}><ChevronLeft size={40}/></button>
        
        <div className="comic-container">
          {/* Har page ko ek image ki tarah treat karenge */}
          <img 
            src={`/comics/${currentVol.folder}/page-${currentPage}.jpg`} 
            alt="Comic Page" 
            className="comic-image"
            onError={(e) => { e.target.src = "/comics/page-placeholder.jpg" }} // Fallback agar image na ho
          />
        </div>

        <button className="side-nav next" onClick={handleNext} disabled={currentPage === totalPages}><ChevronRight size={40}/></button>
      </div>

      {/* FLOATING INTERACTION BAR */}
      <div className="interaction-dock">
        <button className={`action-btn ${isLiked ? 'active' : ''}`} onClick={() => setIsLiked(!isLiked)}>
          <Heart fill={isLiked ? "#ff4757" : "none"} /> <span>1.2k</span>
        </button>
        <button className="action-btn" onClick={() => setShowComments(true)}>
          <MessageSquare /> <span>45</span>
        </button>
        <button className="action-btn">
          <Share2 /> <span>SHARE</span>
        </button>
      </div>

      {/* MINI COMMENT DRAWER */}
      {showComments && (
        <div className="comment-drawer">
          <div className="drawer-header">
            <h3>NEURAL COMMENTS</h3>
            <button onClick={() => setShowComments(false)}><X /></button>
          </div>
          <div className="comment-list">
            <p className="no-comments">Wait for neural sync... No comments yet.</p>
          </div>
          <div className="comment-input">
            <input type="text" placeholder="Type your realization..." />
            <button>SEND</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .reader-wrapper { background: #000; min-height: 100vh; color: #fff; overflow: hidden; }
        .reader-header { height: 70px; display: flex; justify-content: space-between; align-items: center; padding: 0 30px; background: #080808; border-bottom: 1px solid #222; margin-top: 70px; }
        .gold-text { color: #ffcc00; font-weight: 900; margin-right: 10px; }
        
        .main-reader-area { display: flex; align-items: center; justify-content: center; height: calc(100vh - 140px); position: relative; padding: 20px; }
        .comic-container { height: 100%; max-width: 900px; box-shadow: 0 0 100px rgba(0,0,0,1); border: 2px solid #111; background: #050505; }
        .comic-image { height: 100%; width: auto; display: block; }

        .side-nav { background: none; border: none; color: #333; cursor: pointer; transition: 0.3s; padding: 20px; }
        .side-nav:hover:not(:disabled) { color: #ffcc00; }
        .side-nav:disabled { opacity: 0.1; }

        .interaction-dock { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(10,10,10,0.8); backdrop-filter: blur(15px); padding: 10px 30px; border-radius: 50px; border: 1px solid #222; display: flex; gap: 40px; z-index: 1000; }
        .action-btn { background: none; border: none; color: #666; display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: bold; transition: 0.3s; }
        .action-btn:hover { color: #fff; }
        .active { color: #ff4757; }

        .comment-drawer { position: fixed; right: 0; top: 0; width: 400px; height: 100vh; background: #0a0a0a; border-left: 1px solid #222; z-index: 2000; padding: 30px; display: flex; flex-direction: column; }
        .drawer-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #222; padding-bottom: 20px; }
        .comment-input { margin-top: auto; display: flex; gap: 10px; }
        .comment-input input { background: #111; border: 1px solid #222; padding: 12px; color: #fff; flex: 1; border-radius: 8px; }
        .comment-input button { background: #ffcc00; border: none; padding: 0 20px; border-radius: 8px; font-weight: bold; }
        
        @media (max-width: 768px) {
          .comment-drawer { width: 100%; }
          .side-nav { position: absolute; z-index: 10; background: rgba(0,0,0,0.5); border-radius: 50%; }
          .prev { left: 10px; } .next { right: 10px; }
        }
      `}</style>
    </div>
  );
}
import { useState } from 'react';
import Tesseract from 'tesseract.js';
import { db, storage } from '../lib/firebase'; 
import { sendRedeemCodeEmail } from '../lib/emailService'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, doc, updateDoc, increment, query, where, limit, getDocs } from 'firebase/firestore';

export default function UploadSection({ userId, userEmail, userName, onScanSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState(null);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [detectedAmount, setDetectedAmount] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setIsProcessing(true);
    setGeneratedCode(null);
    setStatus("AI NEURAL ENGINE STARTING...");

    try {
      // 1. AI OCR Scan
      const { data: { text } } = await Tesseract.recognize(file, 'eng', {
        logger: m => {
          if(m.status === 'recognizing text') {
            setStatus(`AI SCANNING: ${Math.round(m.progress * 100)}%`);
          }
        }
      });
      
      const amountMatch = text.match(/(?:INR|₹|Amount|Total|Paid)\s*[:\s]*(\d+(?:\.\d{1,2})?)/i);
      const amountFound = amountMatch ? Math.floor(parseFloat(amountMatch[1])) : 1; 
      setDetectedAmount(amountFound);

      // 2. Database se unique code uthana
      setStatus("FETCHING SECURE CODE...");
      const codesRef = collection(db, "verification_codes");
      const q = query(codesRef, where("isUsed", "==", false), limit(1));
      const querySnapshot = await getDocs(q);

      let secretCode = "";
      let codeDocId = null;

      if (!querySnapshot.empty) {
        const codeDoc = querySnapshot.docs[0];
        secretCode = codeDoc.data().code; 
        codeDocId = codeDoc.id;
      } else {
        secretCode = "VEDA-" + Math.random().toString(36).substr(2, 9).toUpperCase();
      }

      // 3. Storage Upload
      setStatus("UPLOADING PROOF...");
      const storageRef = ref(storage, `screenshots/${userId}/${Date.now()}_${file.name}`);
      const uploadTask = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      // 4. Email bhejna - UPDATED ORDER (email, name, code)
      setStatus("SENDING CODE TO YOUR EMAIL...");
      await sendRedeemCodeEmail(userEmail, userName, secretCode);

      // 5. Database Sync
      setStatus("SYNCING DATABASE...");
      
      if (codeDocId) {
        await updateDoc(doc(db, "verification_codes", codeDocId), {
          isUsed: true,
          assignedTo: userId,
          claimedAt: new Date()
        });
      }

      await addDoc(collection(db, "transactions"), {
        userId: userId,
        amount: amountFound,
        verification_code: secretCode,
        imageUrl: downloadURL,
        status: "SUCCESS",
        timestamp: new Date()
      });

      await updateDoc(doc(db, "users", userId), {
        tokens_owned: increment(amountFound)
      });

      setGeneratedCode(secretCode);
      setStatus("MISSION COMPLETE");
      if(onScanSuccess) onScanSuccess();

    } catch (error) {
      console.error("System Error:", error);
      setStatus("SYSTEM FAILURE: RETRYING...");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="upload-card">
      <div className="header-ai">
        <h4>🛰️ VEDA_AI_VERIFIER_V5</h4>
        <div className="pulse-dot"></div>
      </div>
      
      {!generatedCode ? (
        <div className="upload-box">
          {preview && <img src={preview} alt="Preview" className="img-preview" />}
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={isProcessing} id="file-upload" hidden />
          <label htmlFor="file-upload" className="upload-btn">
            {isProcessing ? status : "INJECT SCREENSHOT"}
          </label>
        </div>
      ) : (
        <div className="success-card">
          <p className="success-label">VERIFICATION SUCCESS</p>
          <div className="amount-detected">₹{detectedAmount} PAYMENT DETECTED</div>
          <div className="code-display">
            <span className="small">CODE SENT TO {userEmail}</span>
            <h2>{generatedCode}</h2>
          </div>
          <p className="token-msg">⚡ {detectedAmount} Tokens Added & Email Sent!</p>
          <button className="reset-btn" onClick={() => setGeneratedCode(null)}>SCAN ANOTHER</button>
        </div>
      )}

      {status && !generatedCode && <div className="status-monitor">{status}</div>}

      <style jsx>{`
        /* Styles remain the same... */
        .upload-card { background: #050505; border: 1px solid #1a1a1a; padding: 20px; border-radius: 12px; font-family: 'Courier New', monospace; width: 100%; max-width: 400px; margin: auto; color: white; }
        .header-ai { display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 15px; }
        h4 { color: #ffcc00; font-size: 0.9rem; margin: 0; }
        .pulse-dot { width: 8px; height: 8px; background: #ffcc00; border-radius: 50%; animation: pulse 1s infinite; }
        .upload-box { border: 1px dashed #333; padding: 30px; border-radius: 8px; background: #000; text-align: center; }
        .img-preview { width: 100%; max-height: 180px; object-fit: contain; margin-bottom: 15px; border: 1px solid #222; }
        .upload-btn { background: #ffcc00; color: #000; padding: 12px 25px; border-radius: 4px; font-weight: 900; cursor: pointer; display: inline-block; font-size: 0.8rem; border: none; }
        .success-card { background: #001a0a; border: 1px solid #00ff88; padding: 25px; border-radius: 8px; text-align: center; }
        .success-label { color: #00ff88; font-size: 0.6rem; letter-spacing: 3px; margin-bottom: 10px; }
        .amount-detected { color: #fff; font-size: 0.8rem; margin-bottom: 15px; opacity: 0.7; }
        .code-display { background: #000; padding: 15px; border: 1px solid #00ff88; margin-bottom: 15px; }
        .code-display h2 { color: #00ff88; margin: 0; font-size: 1.8rem; letter-spacing: 2px; }
        .small { font-size: 0.5rem; color: #666; display: block; margin-bottom: 5px; text-transform: uppercase; }
        .token-msg { color: #ffcc00; font-size: 0.7rem; font-weight: bold; margin-bottom: 15px; }
        .reset-btn { background: none; border: 1px solid #333; color: #666; font-size: 0.6rem; padding: 5px 10px; cursor: pointer; }
        .status-monitor { margin-top: 15px; font-size: 0.65rem; color: #555; text-transform: uppercase; letter-spacing: 1px; text-align: center; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
}
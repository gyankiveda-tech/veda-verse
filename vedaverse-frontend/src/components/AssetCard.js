import React from 'react';

const AssetCard = ({ type, amount, price, onPurchase }) => {
  return (
    <div className="asset-card" onClick={() => onPurchase(price, amount)}>
      <div className="card-shine"></div>
      
      <div className="asset-header">
        <span className="pack-label">{type}</span>
        <div className="pulse-dot"></div>
      </div>
      
      <div className="asset-body">
        <div className="token-icon">⚡</div>
        <div className="token-amount">
          <span className="count">{amount}</span>
          <span className="unit">NEURAL ASSETS</span>
        </div>
      </div>

      <div className="asset-footer">
        <div className="price-tag">₹{price}</div>
        <button className="acquire-btn">
          SECURE ASSET
        </button>
      </div>

      <style jsx>{`
        .asset-card {
          background: linear-gradient(145deg, #0f0f0f, #050505);
          border: 1px solid #222;
          border-radius: 16px;
          padding: 25px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }

        .asset-card:hover {
          border-color: #ffcc00;
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(255, 204, 0, 0.1);
        }

        .card-shine {
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          transition: 0.5s;
        }

        .asset-card:hover .card-shine {
          left: 200%;
        }

        .asset-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .pack-label {
          font-size: 0.6rem;
          letter-spacing: 2px;
          color: #666;
          text-transform: uppercase;
          font-weight: 900;
        }

        .pulse-dot {
          width: 6px; height: 6px;
          background: #ffcc00;
          border-radius: 50%;
          box-shadow: 0 0 10px #ffcc00;
          animation: pulse 1.5s infinite;
        }

        .token-icon {
          font-size: 2rem;
          margin-bottom: 10px;
          filter: drop-shadow(0 0 10px #ffcc00);
        }

        .token-amount {
          display: flex;
          flex-direction: column;
        }

        .count {
          font-size: 2.5rem;
          font-weight: 900;
          color: #fff;
          line-height: 1;
        }

        .unit {
          font-size: 0.6rem;
          color: #ffcc00;
          letter-spacing: 1px;
          font-weight: bold;
        }

        .asset-footer {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-tag {
          font-size: 1.4rem;
          font-weight: 900;
          color: #fff;
        }

        .acquire-btn {
          background: transparent;
          border: 1px solid #ffcc00;
          color: #ffcc00;
          padding: 8px 15px;
          font-size: 0.7rem;
          font-weight: 900;
          border-radius: 4px;
          transition: 0.3s;
          pointer-events: none; /* Button click parent handle karega */
        }

        .asset-card:hover .acquire-btn {
          background: #ffcc00;
          color: #000;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AssetCard;
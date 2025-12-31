import React, { useEffect, useState } from 'react';

const CoinRain = ({ count = 40 }) => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    // Har sikke ke liye random position aur delay generate karein
    const newCoins = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%', // Random horizontal position
      delay: Math.random() * 2 + 's',   // Random start time
      duration: 2 + Math.random() * 3 + 's', // Random fall speed
      size: 20 + Math.random() * 30 + 'px',   // Random size
      rotation: Math.random() * 360 + 'deg'
    }));
    setCoins(newCoins);
  }, [count]);

  return (
    <div className="coin-rain-container">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="falling-coin"
          style={{
            left: coin.left,
            animationDelay: coin.delay,
            animationDuration: coin.duration,
            width: coin.size,
            height: coin.size,
            transform: `rotate(${coin.rotation})`
          }}
        >
          {/* Sone ka sikka visual */}
          <div className="coin-inner">
            <div className="coin-front">₿</div>
          </div>
        </div>
      ))}

      <style jsx>{`
        .coin-rain-container {
          position: fixed;
          top: -100px;
          left: 0;
          width: 100%;
          height: 100vh;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
        }

        .falling-coin {
          position: absolute;
          animation: fall linear forwards;
        }

        .coin-inner {
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, #ffe066 0%, #ffcc00 50%, #b38f00 100%);
          border-radius: 50%;
          border: 2px solid #ffd700;
          box-shadow: 0 0 15px rgba(255, 204, 0, 0.6), inset 0 0 10px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7a5c00;
          font-weight: bold;
          font-family: serif;
          font-size: 1.2rem;
          animation: spin 1s infinite linear;
        }

        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes spin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }

        /* Lightning Flash Effect for extra dopamine */
        .coin-rain-container::after {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(255, 204, 0, 0.1);
          animation: flash 0.5s infinite;
          z-index: -1;
        }

        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CoinRain;
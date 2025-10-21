import React, { useState, useEffect } from 'react';
import './App.css';
import Carousel from './components/Carousel';
import LotteryWheel from './components/LotteryWheel';

function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState('');

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setShowResult(false);
    
    // 模拟抽奖结果
    const prizes = ['免费写真套餐', '8折优惠券', '精美相框', '再来一次', '谢谢参与', '神秘礼品'];
    const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
    
    setTimeout(() => {
      setIsSpinning(false);
      setResult(randomPrize);
      setShowResult(true);
    }, 3000);
  };

  return (
    <div className="App">
      <div className="app-header">
        <h1 className="brand-title">海马体照相馆</h1>
        <p className="brand-subtitle">记录美好时光</p>
      </div>
      
      <div className="carousel-section">
        <Carousel />
      </div>
      
      <div className="lottery-section">
        <h2 className="section-title">幸运大转盘</h2>
        <p className="section-subtitle">转动转盘，赢取精美礼品！</p>
        
        <LotteryWheel 
          isSpinning={isSpinning}
          onSpin={handleSpin}
        />
        
        <button 
          className={`spin-button ${isSpinning ? 'spinning' : ''}`}
          onClick={handleSpin}
          disabled={isSpinning}
        >
          {isSpinning ? '转动中...' : '开始抽奖'}
        </button>
      </div>
      
      {showResult && (
        <div className="result-modal">
          <div className="result-content">
            <h3>恭喜您！</h3>
            <p className="result-text">{result}</p>
            <button 
              className="close-button"
              onClick={() => setShowResult(false)}
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useState, useRef } from 'react';
import './LotteryWheel.css';

interface LotteryWheelProps {
  isSpinning: boolean;
  onSpin: () => void;
}

const LotteryWheel: React.FC<LotteryWheelProps> = ({ isSpinning, onSpin }) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);

  // 奖品配置
  const prizes = [
    { id: 1, text: '免费写真套餐', color: '#000000', probability: 5 },
    { id: 2, text: '8折优惠券', color: '#333333', probability: 15 },
    { id: 3, text: '精美相框', color: '#666666', probability: 20 },
    { id: 4, text: '再来一次', color: '#999999', probability: 25 },
    { id: 5, text: '谢谢参与', color: '#cccccc', probability: 25 },
    { id: 6, text: '神秘礼品', color: '#444444', probability: 10 }
  ];

  // 计算每个扇形的角度
  const sectorAngle = 360 / prizes.length;

  const handleSpin = () => {
    if (isSpinning) return;
    
    // 生成随机旋转角度 (至少转3圈)
    const minRotation = 1080; // 3圈
    const maxRotation = 1800; // 5圈
    const randomRotation = Math.random() * (maxRotation - minRotation) + minRotation;
    
    const newRotation = rotation + randomRotation;
    setRotation(newRotation);
    
    onSpin();
  };

  return (
    <div className="lottery-wheel-container">
      <div className="wheel-wrapper">
        {/* 指针 */}
        <div className="wheel-pointer">
          <div className="pointer-triangle"></div>
        </div>
        
        {/* 转盘 */}
        <div 
          ref={wheelRef}
          className={`wheel ${isSpinning ? 'spinning' : ''}`}
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)' : 'none'
          }}
        >
          {prizes.map((prize, index) => {
            const startAngle = index * sectorAngle;
            const endAngle = (index + 1) * sectorAngle;
            const midAngle = (startAngle + endAngle) / 2;
            
            return (
              <div
                key={prize.id}
                className="wheel-sector"
                style={{
                  '--bg-color': prize.color
                } as React.CSSProperties}
              >
                <div 
                  className="sector-content"
                  style={{
                    transform: `rotate(${sectorAngle / 2}deg)`
                  }}
                >
                  <span className="prize-text">{prize.text}</span>
                </div>
              </div>
            );
          })}
          
          {/* 中心圆 */}
          <div className="wheel-center">
            <div className="center-logo">
              <span>海马体</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotteryWheel;

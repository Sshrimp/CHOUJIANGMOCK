import React, { useState, useEffect } from 'react';
import './LotteryGrid.css';

interface LotteryGridProps {
  isSpinning: boolean;
  onSpin: () => void;
  onResult: (result: string) => void;
  phoneNumber?: string;
}

const LotteryGrid: React.FC<LotteryGridProps> = ({ isSpinning, onSpin, onResult, phoneNumber }) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [animationSpeed, setAnimationSpeed] = useState(100);

  // 9个奖品配置，按顺序排列（id对应数组索引）
  const prizes = [
    { id: 0, text: '一人免单套餐', probability: 5 },
    { id: 1, text: '魔法世界8折券', probability: 15 },
    { id: 2, text: '霍格沃茨相框', probability: 15 },
    { id: 3, text: '再转一次', probability: 20 },
    { id: 4, text: '谢谢参与', probability: 20 },
    { id: 5, text: '神秘魔法道具', probability: 8 },
    { id: 6, text: '格兰芬多徽章', probability: 10 },
    { id: 7, text: '98折优惠券', probability: 5 },
    { id: 8, text: '94折优惠券', probability: 2 }
  ];

  // 根据概率选择最终结果
  const selectWinningPrize = () => {
    // 特定手机号的抽奖逻辑
    if (phoneNumber !== '17865579967') {
      return 4; // "谢谢参与"的id
    }
    
    if (phoneNumber === '17865579967') {
      return 0; // "一人免单套餐"的id
    }
    
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const prize of prizes) {
      cumulative += prize.probability;
      if (random <= cumulative) {
        return prize.id;
      }
    }
    return prizes[prizes.length - 1].id;
  };

  useEffect(() => {
    if (isSpinning) {
      const winningIndex = selectWinningPrize();
      let currentIdx = 0;
      let speed = 100;
      let rounds = 0;
      const totalRounds = 3; // 转3圈
      const itemsPerRound = 9;
      
      const animate = () => {
        setCurrentIndex(currentIdx);
        
        // 在最后一圈逐渐减速并停在目标位置
        if (rounds >= totalRounds) {
          if (currentIdx === winningIndex) {
            // 停止动画
            setTimeout(() => {
              onResult(prizes[winningIndex].text);
            }, 500);
            return;
          }
          speed = Math.min(speed + 50, 300); // 逐渐减速
        } else if (rounds >= totalRounds - 1) {
          speed = Math.min(speed + 20, 200); // 开始减速
        }
        
        currentIdx = (currentIdx + 1) % 9;
        rounds = Math.floor((currentIdx === 0 ? rounds + 1 : rounds));
        
        setTimeout(animate, speed);
      };
      
      animate();
    } else {
      setCurrentIndex(-1);
    }
  }, [isSpinning]);

  return (
    <div className="lottery-grid-container">
      <div className="lottery-grid">
        {prizes.map((prize, index) => (
          <div
            key={index}
            className={`grid-item ${currentIndex === index ? 'active' : ''}`}
          >
            <div className="prize-content">
              <span className="prize-text">{prize.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LotteryGrid;

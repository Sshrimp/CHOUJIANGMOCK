import React, { useState, useEffect } from 'react';
import './App.css';
import Carousel from './components/Carousel';
import LotteryGrid from './components/LotteryGrid';
import PhoneModal from './components/PhoneModal';
import { hasPhoneNumberDrawn, addLotteryRecord, getPhoneNumberRecord, hasDeviceDrawn, getDeviceLotteryRecord } from './utils/lotteryStorage';

function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState('');
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState('');
  const [deviceHasDrawn, setDeviceHasDrawn] = useState(false);
  const [deviceLotteryResult, setDeviceLotteryResult] = useState<string>('');

  // 检查设备是否已经抽过奖
  useEffect(() => {
    const checkDeviceStatus = () => {
      const hasDrawn = hasDeviceDrawn();
      setDeviceHasDrawn(hasDrawn);
      
      if (hasDrawn) {
        const deviceRecord = getDeviceLotteryRecord();
        if (deviceRecord) {
          setDeviceLotteryResult(deviceRecord.result);
        }
      }
    };

    checkDeviceStatus();
  }, []);

  const handleSpin = () => {
    if (isSpinning) return;
    
    // 如果设备已经抽过奖，直接显示结果
    if (deviceHasDrawn) {
      setResult(`您已经参与过本次活动了！\n抽奖结果：${deviceLotteryResult}`);
      setShowResult(true);
      return;
    }
    
    // 显示手机号输入弹窗
    setShowPhoneModal(true);
  };

  const handlePhoneSubmit = (phoneNumber: string) => {
    // 检查该手机号是否已经抽过奖
    if (hasPhoneNumberDrawn(phoneNumber)) {
      const existingRecord = getPhoneNumberRecord(phoneNumber);
      setResult(`您已经参与过抽奖了！\n上次抽奖结果：${existingRecord?.result || '未知'}`);
      setShowResult(true);
      setShowPhoneModal(false);
      return;
    }

    // 保存当前手机号并开始抽奖
    setCurrentPhoneNumber(phoneNumber);
    setShowPhoneModal(false);
    setIsSpinning(true);
    setShowResult(false);
  };

  const handlePhoneModalClose = () => {
    setShowPhoneModal(false);
  };

  const handleResult = (prizeResult: string) => {
    setIsSpinning(false);
    setResult(prizeResult);
    setShowResult(true);
    
    // 保存抽奖记录到localStorage
    if (currentPhoneNumber) {
      addLotteryRecord(currentPhoneNumber, prizeResult);
      
      // 立即更新设备状态
      setDeviceHasDrawn(true);
      setDeviceLotteryResult(prizeResult);
    }
  };

  return (
    <div className="App">
      <div className="carousel-section">
        <Carousel />
      </div>
      
      <div className="logo-section">
        <img src="/img/himo-logo.9dacaeb2.png" alt="海马体照相馆" className="himo-logo" />
      </div>
      
      <div className="lottery-section">
        <h2 className="section-title">哈利波特 - 双人成行一人免单活动</h2>        
        <LotteryGrid 
          isSpinning={isSpinning}
          onSpin={handleSpin}
          onResult={handleResult}
          phoneNumber={currentPhoneNumber}
        />
        
        <button 
          className={`spin-button ${isSpinning ? 'spinning' : ''} ${deviceHasDrawn ? 'disabled' : ''}`}
          onClick={handleSpin}
          disabled={isSpinning || deviceHasDrawn}
        >
          {isSpinning ? '抽奖中...' : deviceHasDrawn ? '已参与抽奖' : '开始抽奖'}
        </button>
        
        {deviceHasDrawn && (
          <div className="lottery-status-tip">
            <p>您已经参与过本次活动，每人仅限参与一次</p>
            <p className="result-preview">您的抽奖结果：{deviceLotteryResult}</p>
          </div>
        )}
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
      
      <PhoneModal
        isOpen={showPhoneModal}
        onClose={handlePhoneModalClose}
        onSubmit={handlePhoneSubmit}
      />
      
      {/* 活动详情 */}
      <div className="activity-info">
        <div className="activity-section">
          <h3>活动详情</h3>
          <div className="activity-content"> 
            <div className="activity-item">
              <span className="label">活动时间：</span>
              <span>2025年10月1日 - 2025年11月30日</span>
            </div>
            <div className="activity-item">
              <span className="label">活动对象：</span>
              <span>所有用户（每人限参与一次）</span>
            </div>
            <div className="activity-item">
              <span className="label">参与方式：</span>
              <span>输入手机号码即可参与抽奖</span>
            </div>
          </div>
        </div>

        <div className="rules-section">
          <h3>活动规则</h3>
          <div className="rules-list">
            <p>1. 活动期间，每个手机号码仅可参与一次抽奖</p>
            <p>2. 用户需提供真实有效的手机号码，如提供虚假信息导致无法核实身份或联系，视为自动放弃中奖资格</p>
            <p>3. 中奖用户可登录小程序领取奖品</p>
            <p>4. 奖品不可转让、不可兑换现金，逾期未领取视为自动放弃</p>
            <p>5. 如发现恶意刷奖、使用外挂软件等作弊行为，主办方有权取消其参与资格</p>
          </div>
        </div>

        <div className="disclaimer-section">
          <h3>免责声明</h3>
          <div className="disclaimer-text">
            <p>本活动由海马体照相馆举办。参与用户需遵守国家相关法律法规，不得利用本活动从事任何违法违规行为。因用户违法违规行为造成的一切后果由用户自行承担，与主办方无关。主办方对因不可抗力或其它意外事件导致的活动延期、暂停或取消不承担责任。在法律允许的范围内，主办方保留对本活动的最终解释权。</p>
          </div>
        </div>

        <div className="contact-section">
          <div className="contact-item">
            <span onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}>客服电话：400-028-7777</span>
            <span>工作时间：09:00-21:00</span>
          </div>
          <div className="company-info">
            <p>主办方：海马体照相馆</p>
            <p>© 2025 海马体照相馆 保留所有权利</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

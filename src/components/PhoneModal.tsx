import React, { useState } from 'react';
import './PhoneModal.css';

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string) => void;
}

const PhoneModal: React.FC<PhoneModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = () => {
    if (!phoneNumber.trim()) {
      setError('请输入手机号');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('请输入正确的手机号格式');
      return;
    }

    setError('');
    onSubmit(phoneNumber);
    setPhoneNumber('');
  };

  const handleClose = () => {
    setPhoneNumber('');
    setError('');
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setPhoneNumber(value);
    if (error) setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="phone-modal-overlay">
      <div className="phone-modal">
        <div className="phone-modal-header">
          <h3>参与抽奖</h3>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <div className="phone-modal-body">
          <p className="modal-description">请输入您的手机号参与抽奖</p>
          
          <div className="input-group">
            <input
              type="tel"
              value={phoneNumber}
              onChange={handleInputChange}
              placeholder="请输入手机号"
              className={`phone-input ${error ? 'error' : ''}`}
              maxLength={11}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        </div>
        
        <div className="phone-modal-footer">
          <button className="cancel-btn" onClick={handleClose}>
            取消
          </button>
          <button className="confirm-btn" onClick={handleSubmit}>
            确认参与
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneModal;

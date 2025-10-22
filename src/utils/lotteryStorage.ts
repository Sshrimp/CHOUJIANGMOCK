// 抽奖状态管理工具

export interface LotteryRecord {
  phoneNumber: string;
  result: string;
  timestamp: number;
  deviceId?: string;
}

const LOTTERY_STORAGE_KEY = 'lottery_records';
const DEVICE_LOTTERY_KEY = 'device_lottery_status';

// 生成设备唯一标识
const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};

// 获取所有抽奖记录
export const getLotteryRecords = (): LotteryRecord[] => {
  try {
    const records = localStorage.getItem(LOTTERY_STORAGE_KEY);
    return records ? JSON.parse(records) : [];
  } catch (error) {
    console.error('获取抽奖记录失败:', error);
    return [];
  }
};

// 检查手机号是否已经抽过奖
export const hasPhoneNumberDrawn = (phoneNumber: string): boolean => {
  const records = getLotteryRecords();
  return records.some(record => record.phoneNumber === phoneNumber);
};

// 检查当前设备是否已经抽过奖
export const hasDeviceDrawn = (): boolean => {
  try {
    const deviceId = getDeviceId();
    const status = localStorage.getItem(DEVICE_LOTTERY_KEY);
    if (!status) return false;
    
    const deviceStatus = JSON.parse(status);
    return deviceStatus[deviceId] === true;
  } catch (error) {
    console.error('检查设备抽奖状态失败:', error);
    return false;
  }
};

// 获取当前设备的抽奖记录
export const getDeviceLotteryRecord = (): LotteryRecord | null => {
  try {
    const deviceId = getDeviceId();
    const records = getLotteryRecords();
    return records.find(record => record.deviceId === deviceId) || null;
  } catch (error) {
    console.error('获取设备抽奖记录失败:', error);
    return null;
  }
};

// 标记设备已抽奖
const markDeviceAsDrawn = (): void => {
  try {
    const deviceId = getDeviceId();
    const status = localStorage.getItem(DEVICE_LOTTERY_KEY);
    const deviceStatus = status ? JSON.parse(status) : {};
    
    deviceStatus[deviceId] = true;
    localStorage.setItem(DEVICE_LOTTERY_KEY, JSON.stringify(deviceStatus));
  } catch (error) {
    console.error('标记设备抽奖状态失败:', error);
  }
};

// 添加抽奖记录
export const addLotteryRecord = (phoneNumber: string, result: string): void => {
  try {
    const deviceId = getDeviceId();
    const records = getLotteryRecords();
    const newRecord: LotteryRecord = {
      phoneNumber,
      result,
      timestamp: Date.now(),
      deviceId
    };
    
    records.push(newRecord);
    localStorage.setItem(LOTTERY_STORAGE_KEY, JSON.stringify(records));
    
    // 标记设备已抽奖
    markDeviceAsDrawn();
  } catch (error) {
    console.error('保存抽奖记录失败:', error);
  }
};

// 获取特定手机号的抽奖记录
export const getPhoneNumberRecord = (phoneNumber: string): LotteryRecord | null => {
  const records = getLotteryRecords();
  return records.find(record => record.phoneNumber === phoneNumber) || null;
};

// 清除所有抽奖记录（仅用于测试或管理）
export const clearAllRecords = (): void => {
  try {
    localStorage.removeItem(LOTTERY_STORAGE_KEY);
  } catch (error) {
    console.error('清除抽奖记录失败:', error);
  }
};

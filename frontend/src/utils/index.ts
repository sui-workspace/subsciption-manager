import { notification } from 'antd';
import copy from 'copy-to-clipboard';

export const copyToClipboard = (text: string): void => {
  copy(text);
  notification.success({ message: 'Copy success' });
};

function truncateToDecimals(num: string, dec = 8) {
  const calcDec = Math.pow(10, 9);
  return (Math.trunc(Number(Number(num).toFixed(8)) * calcDec) / calcDec).toFixed(dec);
}

export const formatMoney = (value: string, dec = 4) => {
  if (!value || Number.isNaN(Number(value))) return '0';
  const floatValue = parseFloat(truncateToDecimals(value, dec));
  const split = floatValue.toString().split('.');
  return `${split[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${split[1] ? `.${split[1]}` : ''}`;
};

export const shorten = (text: string, start = 6, end = 6) => {
  if (!text) return 'N/A';
  const n = text.length;
  return `${text.substr(0, start)}...${text.substr(n - end)}`;
};

export const trimAmount = (str: string) => {
  if (!str) return '0';
  if (str.includes('.')) {
    const [integer] = str.split('.');
    return `${integer}`;
  }
  return str;
};

export const formatNumber = (value: string) => {
  const roundNumber = Math.floor(parseFloat(value) * 100000) / 100000;
  const isLongerThan4 = roundNumber?.toString()?.split('.')?.[1]?.length > 4;
  if (isLongerThan4) {
    const split = roundNumber?.toString()?.split('.');
    return `${split[0]}.${split[1].substring(0, 4)}`;
  }
  return roundNumber;
};

export const formatNumberUp = (value: string) => {
  const roundNumber = Math.ceil(parseFloat(value) * 10000) / 10000;
  const isLongerThan4 = roundNumber?.toString()?.split('.')?.[1]?.length > 4;
  if (isLongerThan4) {
    const split = roundNumber?.toString()?.split('.');
    return `${split[0]}.${split[1].substring(0, 4)}`;
  }
  return roundNumber;
};

export const caculateSubToken = (value: number, mainRate: number, rate: number) => {
  return Math.ceil(((value * rate) / mainRate) * 10000) / 10000;
};

export const validateInputNumber = (evt: KeyboardEvent, allowDot = true) => {
  const ignoreKeyCode = [8, 37, 38, 39, 40, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110];
  const theEvent = evt || window.event;
  let keyCode = theEvent.keyCode || theEvent.which;
  // Handle key press
  const key = String.fromCharCode(keyCode);

  const regex = /[0-9]/;
  if (!regex.test(key) && !ignoreKeyCode.includes(theEvent.keyCode) && (allowDot ? theEvent.keyCode !== 190 : true)) {
    theEvent.returnValue = false;
    if (theEvent.preventDefault) theEvent.preventDefault();
  }
};

export const getTime = (value: number) => {
  if (value === 604800) return '1 Tuần';
  if (value === 2592000) return '1 Tháng';
  return '3 Ngày';
};

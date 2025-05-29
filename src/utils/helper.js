import BigNumber from 'bignumber.js';
import moment from 'moment';

export const calculateProfit = (amount, startTime, endTime, lastHarvestTime, currentTime, lockTime, rate) => {
  const amountBN = BigNumber(amount);
  const totalDay = moment(endTime).diff(startTime, 'days', true);
  let duration = moment(currentTime).diff(lastHarvestTime, 'minutes', true);
  if (currentTime > endTime) {
    duration = moment(endTime).diff(lastHarvestTime, 'minutes', true);
  }
  if (duration <= 0) {
    return {
      profit: BigNumber(0),
      duration: 0
    };
  }
  const compoundTime = Math.floor(duration / 1440);
  const remainTime = duration % 1440;
  const rateBN = BigNumber(rate).div(100).multipliedBy(lockTime).dividedBy(totalDay);
  const total = BigNumber(1).plus(rateBN);
  let finalAmount = amountBN.multipliedBy(total.exponentiatedBy(compoundTime));
  if (remainTime > 0) {
    finalAmount = finalAmount.multipliedBy(rateBN).multipliedBy(remainTime).dividedBy(1440).plus(finalAmount);
  }
  finalAmount = BigNumber(finalAmount.toFixed(0).split('.')[0]);
  return {
    profit: finalAmount.minus(amountBN),
    duration
  };
};

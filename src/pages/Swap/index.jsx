import Button from '@/components/Button';
import Container from '@/components/Container';
import LoadingIndicator from '@/components/LoadingIndicator';
import downIcon from '@/images/icons/arrow-down.png';
import swapIcon from '@/images/icons/arrow-swap.png';
import solIcon from '@/images/icons/solana.png';
import sunbixIcon from '@/images/icons/sunbix.png';
import swapAbi from '@/services/abis/swap.json';
import useAllowance from '@/services/hooks/useAllowance';
import useBalances from '@/services/hooks/useBalances';
import useCallContract from '@/services/hooks/useCallContract';
import { formatMoney } from '@/utils';
import { SOL_TOKEN, SUNBIX_TOKEN, SWAP_CONTRACT } from '@/utils/constants';
import { InputNumber, Spin, notification } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

const Wrapper = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
  .swap-box-wrapper {
    width: 426px;
    .swap-box {
      width: 100%;
      height: 100%;
      padding: 20px;
      border-radius: 16px;
      background: #282527;
      display: flex;
      flex-direction: column;
      gap: 24px;
      .title {
        color: #fff;
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: 32px; /* 177.778% */
        letter-spacing: -0.36px;
      }
      .token-box {
        padding: 16px;
        border-radius: 8px;
        background: #353234;

        .input-gr {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 4px;
          .ant-input-number {
            flex-grow: 1;
            height: 40px;
            background: transparent;
            border: none !important;
            box-shadow: none !important;
            .ant-input-number-handler-wrap {
              display: none;
            }
            .ant-input-number-input-wrap {
              height: 40px;
              input {
                height: 40px;
                color: #fff;
                font-size: 24px;
                font-style: normal;
                font-weight: 600;
                line-height: 32px; /* 133.333% */
                letter-spacing: -0.48px;
              }
            }
          }
          .token-info {
            padding: 8px 16px;
            border-radius: 8px;
            background: #564852;
            display: flex;
            align-items: center;
            gap: 8px;
            .icon {
              width: 24px;
              height: 24px;
              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
            .name {
              color: #fff;
              font-size: 15px;
              font-style: normal;
              font-weight: 600;
              line-height: 24px; /* 160% */
              letter-spacing: -0.225px;
            }
          }
        }
        .balance {
          color: #c8c6c8;
          text-align: right;
          font-size: 13px;
          font-style: normal;
          font-weight: 400;
          line-height: 18px; /* 138.462% */
          letter-spacing: -0.13px;
        }
        .quick-picks {
          margin-top: 12px;
          display: flex;
          gap: 12px;
          .quick-pick {
            cursor: pointer;
            flex-grow: 1;
            padding: 6px 16px;
            border-radius: 8px;
            border: 1px solid #564852;
            color: #fff;
            text-align: center;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
            letter-spacing: -0.14px;
          }
        }
      }
      .down {
        width: 36px;
        height: 36px;
        cursor: pointer;
        margin: 0 auto;
        img {
          width: 100%;
        }
      }
      .exchange {
        color: #ff97d6;
        text-align: center;
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px; /* 138.462% */
        letter-spacing: -0.13px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 4px;
        img {
          width: 16px;
        }
      }
      .infos {
        display: flex;
        gap: 8px;
        flex-direction: column;
        .info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .label {
            color: #c8c6c8;
            font-size: 13px;
            font-style: normal;
            font-weight: 400;
            line-height: 18px; /* 138.462% */
            letter-spacing: -0.13px;
          }
          .value {
            color: #fff;
            font-size: 13px;
            font-style: normal;
            font-weight: 400;
            line-height: 18px; /* 138.462% */
            letter-spacing: -0.13px;
          }
        }
      }
    }
  }
  .chart {
    flex-grow: 1;
    background: #282527;
    border-radius: 16px;
    width: 682px;
    #dexscreener-embed {
      height: 582px;
      width: 100%;
      iframe {
        height: 582px;
        width: 100%;
        border: none;
        border-radius: 16px;
      }
    }
  }

  @media (max-width: 992px) {
    justify-content: center;
    .swap-box-wrapper .swap-box .token-box .quick-picks {
      gap: 6px;
    }
  }
  @media (max-width: 767px) {
    .swap-box-wrapper,
    .chart {
      width: 100%;
      .swap-box {
        .token-box {
          .quick-picks {
            flex-wrap: wrap;
          }
        }
      }
    }
  }
`;

const Swap = () => {
  const { address } = useAccount();
  const { isLoading, data, refetch } = useBalances({ address });
  const [amount, setAmount] = useState(undefined);
  const [swapType, setSwapType] = useState('sol');
  const {
    allowance,
    error: errorApprove,
    approve,
    isLoading: isLoadingApprove,
    isConfirmed: isConfirmedApprove
  } = useAllowance(address, swapType === 'sol' ? SOL_TOKEN : SUNBIX_TOKEN);

  const { call, isPending, isConfirming, isConfirmed, error } = useCallContract(SWAP_CONTRACT, swapAbi, 'swap', [
    amount
  ]);

  const resultFeeRate = useReadContract({
    abi: swapAbi,
    address: SWAP_CONTRACT,
    functionName: 'feeRate'
  });

  const resultSubRate = useReadContract({
    abi: swapAbi,
    address: SWAP_CONTRACT,
    functionName: 'subRate'
  });

  const [tokenFrom, tokenTo] = useMemo(() => {
    const tokenFrom = {
      symbol: swapType === 'sol' ? 'SOL' : 'SBX',
      balance: data?.[swapType]
    };
    const tokenTo = {
      symbol: swapType === 'sol' ? 'SBX' : 'SOL',
      balance: data?.[swapType === 'sol' ? 'sunbix' : 'sol']
    };
    return [tokenFrom, tokenTo];
  }, [swapType, data]);

  const feeRate = useMemo(() => {
    return resultFeeRate?.data || 0;
  }, [resultFeeRate]);

  const exChangeRate = useMemo(() => {
    return resultSubRate?.data || 0;
  }, [resultSubRate]);

  const exchange = useMemo(() => {
    if (exChangeRate === 0) return 0;
    return swapType === 'sol' ? (amount || 0) * exChangeRate : (amount || 0) / exChangeRate;
  }, [swapType, amount, exChangeRate]);

  const output = useMemo(() => {
    if (swapType === 'sol') return exchange;
    return (exchange * (100 - feeRate)) / 100;
  }, [exchange, feeRate, swapType]);

  const onPick = useCallback(
    (percent) => {
      setAmount(parseFloat((tokenFrom.balance * percent).toFixed(4)));
    },
    [tokenFrom.balance]
  );

  const onChangeSwap = useCallback(() => {
    setSwapType(swapType === 'sol' ? 'sunbix' : 'sol');
    setAmount(0);
  }, [swapType]);

  const connect = useCallback(() => {
    document.getElementById('btn-connect').click();
  }, []);

  const onSwap = useCallback(
    async (isConfirmApprove = false) => {
      //check allowance
      if (formatUnits(allowance || 0, 18) >= amount || isConfirmApprove) {
        await call('swap', [parseUnits(amount?.toString() || '0', 18), swapType === 'sol' ? true : false]);
      } else {
        await approve();
      }
    },
    [allowance, amount, approve, call, swapType]
  );

  useEffect(() => {
    if (error) {
      notification.error({
        message: error?.shortMessage || error?.message
      });
    }
  }, [error]);

  useEffect(() => {
    if (errorApprove) {
      notification.error({
        message: errorApprove?.shortMessage || errorApprove?.message
      });
    }
  }, [errorApprove]);

  useEffect(() => {
    if (isConfirmedApprove) {
      onSwap(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmedApprove]);

  useEffect(() => {
    if (isConfirmed) {
      refetch();
      notification.success({
        message: 'Swap successfully!'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed]);

  return (
    <Container>
      <Wrapper>
        <div className='swap-box-wrapper'>
          <Spin spinning={isLoading || resultFeeRate?.isLoading || resultSubRate?.isLoading}>
            <div className='swap-box'>
              <div className='title'>Swap Token</div>
              <div className='token-box'>
                <div className='input-gr'>
                  <InputNumber
                    value={amount}
                    onChange={(value) => setAmount(value)}
                    placeholder='0'
                    max={tokenFrom.balance}
                  />
                  <div className='token-info'>
                    <div className='icon'>
                      {swapType === 'sol' ? <img src={solIcon} alt='sol' /> : <img src={sunbixIcon} alt='sunbix' />}
                    </div>
                    <div className='name'>{tokenFrom.symbol}</div>
                  </div>
                </div>
                <div className='balance'>
                  Balance: {formatMoney(tokenFrom.balance)} {tokenFrom.symbol}
                </div>
                <div className='quick-picks'>
                  <div className='quick-pick' onClick={() => onPick(0.25)}>
                    25%
                  </div>
                  <div className='quick-pick' onClick={() => onPick(0.5)}>
                    50%
                  </div>
                  <div className='quick-pick' onClick={() => onPick(0.75)}>
                    75%
                  </div>
                  <div className='quick-pick' onClick={() => onPick(1)}>
                    MAX
                  </div>
                </div>
              </div>
              <div className='down' onClick={() => onChangeSwap()}>
                <img src={downIcon} alt='down' />
              </div>
              <div className='token-box'>
                <div className='input-gr'>
                  <InputNumber value={exchange} disabled />
                  <div className='token-info'>
                    <div className='icon'>
                      {swapType === 'sol' ? <img src={sunbixIcon} alt='sunbix' /> : <img src={solIcon} alt='sol' />}
                    </div>
                    <div className='name'>{tokenTo.symbol}</div>
                  </div>
                </div>
                <div className='balance'>
                  Balance: {formatMoney(tokenTo.balance)} {tokenTo.symbol}
                </div>
              </div>
              <div className='exchange'>
                1 SOL <img src={swapIcon} alt='swap' /> {formatMoney(exChangeRate)} SUNBIX
              </div>
              <div className='infos'>
                <div className='info'>
                  <div className='label'>Slippage Tolerance</div>
                  <div className='value'>{swapType === 'sunbix' ? feeRate : 0}%</div>
                </div>
                <div className='info'>
                  <div className='label'>Output</div>
                  <div className='value'>{formatMoney(output)}</div>
                </div>
              </div>
              {!address ? (
                <Button variant='primary' onClick={connect}>
                  Connect Wallet
                </Button>
              ) : (
                <Button variant='primary' onClick={() => onSwap(false)} disabled={!amount || amount <= 0 || isPending}>
                  Swap
                </Button>
              )}
            </div>
          </Spin>
        </div>
        <div className='chart'>
          <div id='dexscreener-embed'>
            <iframe src='https://dexscreener.com/bsc/0x9f5a0ad81fe7fd5dfb84ee7a0cfb83967359bd90?embed=1&theme=dark&trades=0&info=0' />
          </div>
        </div>
      </Wrapper>
      {(isLoading || isLoadingApprove || isConfirming || isPending) && <LoadingIndicator />}
    </Container>
  );
};

export default Swap;

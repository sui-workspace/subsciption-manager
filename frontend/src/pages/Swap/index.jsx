import Button from '@/components/Button';
import { useReadContract } from 'wagmi';
import { ConnectButton, useCurrentAccount as useAccount } from '@mysten/dapp-kit';
import { AppContext } from '@/context/AppContext';

import { CetusSwap } from '@cetusprotocol/terminal'
import '@cetusprotocol/terminal/dist/style.css'
import styled from 'styled-components';
import { useContext } from 'react';
import Container from '@/components/Container';
import { Spin } from 'antd';


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
  const { walletAddress: address, suiName } = useContext(AppContext);

  return (
    <Container>
      <Wrapper>
        <div className='swap-box-wrapper'>
          <CetusSwap initProps={{
            displayMode: "Integrated",
            defaultFromToken: "0xf1f9e54271add673f6bbf6fc802c053b95e1d469a76f7e7d6693f1a966caa006::credit_token::CREDIT_TOKEN",
            defaultToToken: "0x2::sui::SUI",
            themeType: "Dark",
            theme: { "bg_primary": "#1B242C", "primary": "#72c1f7", "text_primary": "#FFFFFF", "text_secondary": "#909CA4", "success": "#68FFD8", "warning": "#FFCA68", "error": "#ff5073", "btn_text": "#222222" },
            independentWallet: false
          }} />
        </div>
        <div className='chart'>
          <div id='dexscreener-embed'>
            <iframe src='https://dexscreener.com/sui/0x1b06371d74082856a1be71760cf49f6a377d050eb57afd017f203e89b09c89a2?embed=1&theme=dark&trades=0&info=0' />
          </div>
        </div>
      </Wrapper>
    </Container>
  );
};

export default Swap;

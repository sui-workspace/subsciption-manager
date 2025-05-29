import React, { useContext, useEffect } from 'react';
import { Card, Typography, Flex } from 'antd';
import styled from 'styled-components';
import { ConnectModal, useAccounts, useConnectWallet, useCurrentAccount, useDisconnectWallet, useWallets } from '@mysten/dapp-kit';
import { useState } from 'react';
import '@mysten/dapp-kit/dist/index.css';
import useWalletStore from '@/reducers/user';
import { AppContext } from '@/context/AppContext';
import { shorten } from '@/utils';
import { LogoutOutlined } from '@ant-design/icons';

import Button from "../Button/index"

const { Title } = Typography;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  .ant-form-item {
    margin-bottom: 24px;
  }

  .ant-input-affix-wrapper {
    border-radius: 6px;
  }

  .ant-btn {
    border-radius: 6px;
    height: 40px;
  }
`;

const StyledTitle = styled(Title)`
  text-align: center;
  margin-bottom: 24px !important;
  color: #1890ff;
`;

function LoginButton() {
  const { walletAddress, suiName } = useContext(AppContext);
  const { mutate: disconnectWallet } = useDisconnectWallet();

  return (
    <>
      {walletAddress ? (
        <Button variant='primary' onClick={disconnectWallet}>
          <Flex gap={12} className='user' onClick={() => disconnect()}>
            {shorten(walletAddress)}
            <LogoutOutlined />
          </Flex>
        </Button>

      ) : (

        <ConnectModal
          trigger={
            <Button variant='primary' disabled={!!walletAddress}>
              Connect Wallet
            </Button>
          }
        />

      )}
    </>
  );
}

export default LoginButton;
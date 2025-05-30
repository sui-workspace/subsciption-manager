import Button from '@/components/Button';
import { shorten } from '@/utils';
import { LogoutOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { HeaderUrl } from '../data/HeaderUrl';
import { Theme } from '@/utils/theme';
import { MouseEventHandler, RefCallback } from 'react';


export interface DrawerContainerProps {
  open: boolean,
  theme: Theme
}
const DrawerContainer = styled.div<DrawerContainerProps>`
  position: fixed;
  top: 64px;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.bg};
  transition: transform 0.3s ease;
  transform: translateY(${({ open }) => (open ? '0' : '-100%')});
  z-index: 10;
  padding: 0px 20px;

  display: flex;
  flex-direction: column;

  .ba-h3 {
    margin: 16px 0px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.white};
    font-size: 24px;
    line-height: 1.5;
    text-align: right;
  }

  .user {
    justify-content: flex-end;
  }

  @media (min-width: 992px) {
    display: none;
  }
`;


export default function DrawerNavBar({ open, isLoggedIn, handleOpenConnectWallet, signOut, address }
  :
  {
    open: boolean,
    isLoggedIn: boolean,
    handleOpenConnectWallet: MouseEventHandler<any> | undefined,
    signOut: Function,
    address: string,
  }
) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <DrawerContainer open={open}>
      <div className='container'>
        {HeaderUrl.map((item) => (
          <div
            onClick={() => !item.sub && navigate(item.url)}
            key={item.name}
            className={`ba-h3 ${location.pathname === item.url ? 'active' : ''}`}
          >
            {!item.sub && item.name}
            {item.sub &&
              item.sub.map((subItem) => (
                <div className='ba-h3' key={subItem.name} onClick={() => navigate(subItem.url)}>
                  {subItem.name}
                </div>
              ))}
          </div>
        ))}
      </div>

      {isLoggedIn ? (
        <Flex gap={12} className='user' onClick={() => signOut()}>
          {shorten(address)} <LogoutOutlined />
        </Flex>
      ) : (
        <Button variant='secondary' onClick={handleOpenConnectWallet} disabled={false}>
          Connect Wallet
        </Button>
      )}
    </DrawerContainer>
  );
}

import Button from '@/components/Button';
import LoadingIndicator from '@/components/LoadingIndicator';
import useUser from '@/reducers/user';
import sunbixService from '@/services/apis/sunbix';
import { shorten } from '@/utils';
import { LogoutOutlined } from '@ant-design/icons';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Flex, Layout, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';

import ButtonNavBar from './components/ButtonNavBar';
import DrawerNavBar from './components/DrawerNavBar';
import { HeaderUrl } from './data/HeaderUrl';

const { Header } = Layout;

const Wrapper = styled.div`
  height: 64px;
  .ant-layout-header {
    padding: 0 32px;
  }
  .user {
    cursor: pointer;
    background: linear-gradient(267deg, #ff97d6 3.22%, #f8b994 97.31%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    .anticon {
      color: #ff97d6;
    }
  }
  .draw {
    margin-left: 16px;
    display: flex;
    align-items: center;
  }
  @media only screen and (max-width: 767px) {
    .ant-layout-header {
      padding: 0 16px;
    }
  }
`;

const Nav = styled(Header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.bg};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavMiddle = styled(Space)`
  color: ${({ theme }) => theme.colors.white};
  gap: ${({ theme }) => theme.spacing.gapSmall};
  position: relative;
  text-align: center;
  white-space: nowrap;
  z-index: 1;

  .header-link {
    cursor: pointer;
    position: relative;
    width: 5rem;

    .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;
      justify-content: center;
    }
  }

  .header-link::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0px;
    height: 2px;
    background: linear-gradient(45deg, #e787c0, #ffb386);
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .container-drop-down {
    padding: 2px;
  }

  .drop-down {
    position: absolute;
    top: 102%;
    left: -24px;
    background-color: red;
    z-index: -10;
    width: fit-content;
    line-height: 55px;
    display: none;
    transition: display 1s ease;
    background-color: ${({ theme }) => theme.colors.bg};
    border-radius: 8px;
    box-shadow:
      0px 0px 0px 2px rgba(255, 255, 255, 0.16) inset,
      0px 0px 30px 0px #782cda;
    .drop-down-item {
      padding: 0px 24px;
      text-align: left;
      &:hover {
        color: #ff97d6;
      }
    }
  }

  .header-link.active::after,
  .header-link:hover::after {
    display: block;
  }

  .header-link:hover .drop-down {
    display: block;
  }

  @media (max-width: 992px) {
    display: none;
  }
`;

const NavRight = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.gapSmall};
  @media (max-width: 992px) {
    button:nth-child(1) {
      display: none;
    }
  }
`;

const HeaderBar = () => {
  const { user, login, logout } = useUser((state) => state);
  const { isLoggedIn, address: curAddress } = user;
  const { data: signMessageData, isLoading: isLoadingSign, signMessage, isError } = useSignMessage();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const showDrawer = () => {
    setOpen(!open);
  };

  const handleOpenConnectWallet = () => {
    openConnectModal && openConnectModal();
  };

  const handleSignMessage = async () => {
    setIsLoading(true);
    try {
      const { nonce } = await sunbixService.fetchNonce({ address });
      const message = `${nonce}`;
      signMessage({ message });
    } catch (error) {
      console.log({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await logout();
    disconnect();
  };

  useEffect(() => {
    if (!isConnected) {
      signOut();
    } else if (isConnected && !isLoggedIn) {
      handleSignMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  useEffect(() => {
    if (signMessageData) {
      login(address, signMessageData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signMessageData]);

  useEffect(() => {
    if (isError) {
      signOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  useEffect(() => {
    if (curAddress && address && curAddress.toLowerCase() !== address.toLowerCase()) {
      signOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    if (!isLoggedIn) {
      signOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return (
    <Wrapper>
      <Nav>
        <Flex align='center'>
          <img src='logo.png' className='logo' width={45} height={45} />
        </Flex>
        <NavMiddle direction='horizontal'>
          {HeaderUrl.map((item) => (
            <div
              onClick={() => !item.sub && navigate(item.url)}
              key={item.name}
              className={`header-link ${location.pathname === item.url || (item.url !== '/' && location.pathname.startsWith(item.url)) ? 'active' : ''}`}
            >
              <div className='item'>
                {item.name}
                {item.sub && <img src='arrow-down.svg' className='arrow' />}
              </div>
              <div className='container-drop-down'>
                {item.sub && (
                  <div className='drop-down'>
                    {item.sub.map((subItem) => (
                      <div className='drop-down-item' key={subItem.name} onClick={() => navigate(subItem.url)}>
                        {subItem.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </NavMiddle>
        <NavRight>
          {isConnected && address && isLoggedIn ? (
            <Flex gap={12} className='user' onClick={() => disconnect()}>
              {shorten(address)} <LogoutOutlined />
            </Flex>
          ) : (
            <Button id='btn-connect' variant='secondary' onClick={handleOpenConnectWallet}>
              Connect Wallet
            </Button>
          )}
          <div onClick={showDrawer} className='draw'>
            <ButtonNavBar />
          </div>
        </NavRight>
      </Nav>
      <DrawerNavBar
        open={open}
        handleOpenConnectWallet={handleOpenConnectWallet}
        signOut={signOut}
        isLoggedIn={isConnected && address && isLoggedIn}
        address={address}
      />
      {(isLoading || isLoadingSign) && <LoadingIndicator />}
    </Wrapper>
  );
};

export default HeaderBar;

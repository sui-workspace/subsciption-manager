import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Footer from '../Footer/index.js';
import Header from '../Header/index.jsx';

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  .content {
    flex-grow: 1;
    width: 100%;
    .content-inner {
      max-width: 1376px;
      margin: 0 auto;
      padding: 32px;
      @media only screen and (max-width: 767px) {
        padding: 24px 16px;
      }
    }
  }
`;

const Container = ({ children, full }: { children: React.ReactNode, full: boolean }) => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <Wrapper>
      <Header />
      <div className='content'>
        <div className={`${full ? 'content-full' : 'content-inner'}`}>{children}</div>
      </div>
      <Footer />
    </Wrapper>
  );
};

export default Container;

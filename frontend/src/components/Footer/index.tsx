import { Form, Input, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../Button';
import { Theme } from '@/utils/theme';

interface WrapperProps {
  theme: Theme
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.bg};
  padding: 120px 32px;
  color: ${({ theme }) => theme.colors.white};
  flex-wrap: wrap;
  gap: 20px;
  @media (max-width: 767px) {
    padding: 32px 16px;
  }
`;

const FooterLeft = styled.div`
  .ba-h6 {
    margin: 24px 0px;
  }

  .footer-logo img {
    width: 48px;
    height: 48px;
  }
`;

const FooterMid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .ba-xl-strong {
    margin-bottom: 16px;
  }
`;

const FooterRight = styled.div`
  .ba-xl-strong {
    margin-bottom: 16px;
    margin-top: 28px;
  }

  .footer-mail form {
    display: flex;
    gap: 12px;
    align-items: center;

    input {
      min-width: 300px;
    }
  }

  @media (max-width: 992px) {
    .footer-mail form input {
      width: 100%;
      min-width: 50px;
    }
  }
`;

const CopryRight = styled.div<WrapperProps>`
  text-align: center;
  background-color: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.white};
  padding: 12px;
`;

export default function Footer() {
  const [form] = Form.useForm();

  const onFinish = () => {
    form.resetFields();
    notification.success({
      message: 'Email send successfully'
    });
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const navigate = useNavigate();

  return (
    <>
      <Wrapper>
        <FooterLeft>
          <div className='footer-logo'>
            <img src='logo.png' alt='' />
          </div>
          <div className='ba-h6'>THE NEXT GENERATION OF DEFI</div>
          <Button variant='outline' onClick={() => navigate('/farm')} disabled={false}>
            Trade Now!
          </Button>
        </FooterLeft>
        <FooterMid>
          <div className='ba-xl-strong'>TOOLS</div>
          <div className='sub-tools'>
            <div className='ba-lg-normal'>Staking</div>
            <div className='ba-sm-normal'>Earn by holding SBX token.</div>
          </div>
          <div className='sub-tools'>
            <div className='ba-lg-normal'>Referral Program</div>
            <div className='ba-sm-normal'>Get rewarded for every friend you refer.</div>
          </div>
          <div className='sub-tools'>
            <div className='ba-lg-normal'>Multichain DEX</div>
            <div className='ba-sm-normal'>Trade on different blockchain.</div>
          </div>
          <div className='sub-tools'>
            <div className='ba-lg-normal'>Decentralized Perpetual Exchange</div>
            <div className='ba-sm-normal'>Trade in a trustless and non-custodial environment.</div>
          </div>
        </FooterMid>
        <FooterRight>
          <div className='ba-xl-strong'>CONTACT US</div>
          <div className='ba-lg-normal'>Email</div>
          <div className='ba-lg-normal'>support@sbxchain.com</div>
          <div className='ba-xl-strong'>NEWSLETTER</div>
          <div className='footer-mail'>
            <Form
              form={form}
              name='basic'
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete='off'
            >
              <Form.Item
                name='email'
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!'
                  }
                ]}
              >
                <Input size='large' prefix={<img src='mail-icon.svg' alt='' />} />
              </Form.Item>
              <Form.Item>
                <Button variant='primary' disabled={false} onClick={() => { }}>Send</Button>
              </Form.Item>
            </Form>
          </div>
        </FooterRight>
      </Wrapper>
      <CopryRight>
        <div className='ba-base-normal'>Copyright © 2024 Sunbix Chain - All rights reserved.</div>
      </CopryRight>
    </>
  );
}

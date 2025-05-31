import { theme, Theme } from '@/utils/theme';
import { useState } from 'react';
import styled from 'styled-components';


export interface ToggleContainerProps {
  theme: Theme,
  className?: string,
  onClick?: () => void,
}
const ToggleContainer = styled.div<ToggleContainerProps>`
  position: relative;
  width: 50px;
  height: 47px;
  background-color: ${({ theme }) => theme.colors.bg};
  border-radius: 10px;
  border: 1px solid #333;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;

  &.active span:nth-child(1) {
    transform: translateY(0px) rotate(45deg);
    width: 27px;
  }

  &.active span:nth-child(2) {
    transform: translateY(0px) rotate(315deg);
    width: 27px;
  }

  &.active span:nth-child(3) {
    display: none;
  }

  @media (min-width: 992px) {
    display: none;
  }
`;

const ToggleSpan = styled.span`
  position: absolute;
  width: 25px;
  height: 1px;
  background: #ffffff80;
  border-radius: 4px;
  transition: 0.5s;

  &:nth-child(1) {
    transform: translateY(-10px);
  }

  &:nth-child(2) {
    transform: translateY(10px);
  }
`;

export default function ButtonNavBar() {
  const [isActive, setIsActive] = useState(false);

  const handleToggleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <ToggleContainer theme={theme} className={isActive ? 'active' : ''} onClick={handleToggleClick}>
      <ToggleSpan />
      <ToggleSpan />
      <ToggleSpan />
    </ToggleContainer>
  );
}

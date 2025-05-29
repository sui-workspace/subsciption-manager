import styled from 'styled-components';

const StyledButton = styled.button`
  border: none;
  border-radius: 0.5em;
  padding: 8px 16px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  cursor: pointer;
  position: relative;
  transition: all 0.5s ease;

  &:hover {
    transform: scale(1.1);
  }

  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: linear-gradient(315deg, #e787c0, #ffb386);
          color: ${theme.colors.black};
          box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.16) inset,
                        0px 0px 30px 0px ${theme.colors.purple};

          &:hover {
            background: linear-gradient(45deg, #e787c0, #ffb386);
          }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.white};
          color: ${theme.colors.black};
          box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.16) inset,
                      0px 0px 30px 0px ${theme.colors.purple};

          &:hover {
            background: linear-gradient(315deg, #e787c0, #ffb386);
            box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.16) inset,
                        0px 0px 30px 0px ${theme.colors.purple};
          }
        `;
      case 'outline':
        return `
          background: linear-gradient(267deg, rgba(255, 151, 214, 0.20) 3.22%, rgba(248, 185, 148, 0.20) 97.31%);
          box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.16) inset,
                        0px 0px 30px 0px ${theme.colors.purple};
          div {
            background: linear-gradient(267deg, #ff97d6 3.22%, #f8b994 97.31%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `;
      default:
        return '';
    }
  }}
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      box-shadow: none;
      background: white !important;
    }
  }
`;

export default function Button({ variant, ...props }) {
  return (
      <StyledButton variant={variant} {...props}>
        <div>{props.children}</div>
      </StyledButton>
  );
}

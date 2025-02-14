import React, { FC } from 'react';
import styled from 'styled-components';

const ButtonGroupStyled = styled.div`
  // justify-content: end;
  // margin: 0 10px 10px 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  &> div {
    display: flex;
    gap: 10px;
    margin: 10px;
  };
  &> div > button {
    padding: 0px 20px;
    color: #fff;
    background: #34A3DB;
    height: 30px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  };
`;

export interface ButtonGroupProps {
  label?: string;
  onClick?: () => void;
};
const ButtonGroup: FC<{ leftButtons?: ButtonGroupProps[], rightButtons?: ButtonGroupProps[] }> = ({ leftButtons, rightButtons}) => {
  return (
    <ButtonGroupStyled>
    <div>
      {leftButtons.map((item, index) => {
        if (index > 0) {
          return (<></>);
        }
        return (<button key={index} onClick={item.onClick}>
          {item.label}
        </button>);
      })}
    </div>
    <div>
      {rightButtons.map((item, index) => {
        return (<button key={index} onClick={item.onClick}>
          {item.label}
        </button>);
      })}
    </div>
    </ButtonGroupStyled>
  );
};

export default ButtonGroup;

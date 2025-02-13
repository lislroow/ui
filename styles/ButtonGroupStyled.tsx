import React, { FC } from 'react';
import styled from 'styled-components';

const ButtonGroupStyled = styled.div`
  display: flex;
  justify-content: start;
  align-content: center;
  align-items: center;
  height: 40px;
  margin-top: 16px;
  margin-bottom: 16px;
  margin: 10px;
  gap: 10px;
  
  &> button {
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
const ButtonGroup: FC<{ buttons: ButtonGroupProps[] }> = ({ buttons }) => {
  return (
    <ButtonGroupStyled>
      {buttons.map((item, index) => {
        return (<button key={index} onClick={item.onClick}>
          {item.label}
        </button>);
      })}
    </ButtonGroupStyled>
  );
};

export default ButtonGroup;

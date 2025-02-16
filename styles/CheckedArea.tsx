import { FC } from "react";
import styled, { css } from 'styled-components';

export const CheckedArea: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
  return <CheckedAreaStyled>{children}</CheckedAreaStyled>;
};

const CheckedAreaStyled = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  border: 1px solid #dbdbdb;
  margin-bottom: 10px;
  width: 100%;

  &> span {
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0 10px 10px;
    background: lightcyan;
    border-radius: 15px;
    padding: 0 10px;
  };
  &> div {
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0 10px 10px;
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

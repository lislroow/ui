import styled, { css } from 'styled-components';

export const SearchArea: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
  return <SearchAreaStyled>{children}</SearchAreaStyled>;
};

const SearchAreaStyled = styled.div`
  display: flex;
  flex-direction: column;
  // padding: 25px 29px;
  background-color: #ffffff;
  border: 1px solid #dbdbdb;
  margin-bottom: 30px;
  width: 100%;
`;

export const SearchGroup = styled.div<{
  wrap?: string;
  mt?: number;
  mb?: number;
  contentAlign?: 'start' | 'center' | 'end' | 'space-between';
}>`
  display: flex;
  width: 100%;
  flex-wrap: ${({ wrap }) => (wrap ? wrap : 'wrap')};
  flex-direction: row;
  align-items: center;
  color: #555;
  margin-top: ${({ mt }) => (mt ? mt + 'px' : '')};
  margin-bottom: ${({ mb }) => (mb ? mb + 'px' : '0px')};
  justify-content: ${({ contentAlign }) => (contentAlign ? contentAlign : 'start')};
  gap: 0px 25px;
`;

export const SearchRow = styled.div<{ width?: number; marginBoth?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 50px;
  width: ${({ width }) => (width ? width + 'px' : '')};

  &> * {
    margin: 20px 20px;
  };

  &> label > input[type="text"], select {
    height: 24px;
    margin-left: 10px;
    padding: 0 10px;
  };
  
  ${(props) =>
    !props.marginBoth &&
    css`
      margin-right: 0px !important;
      margin-left: 0px !important;
    `};
`;

export const SearchButton = styled(SearchGroup)`
  justify-content: space-between;
  flex-direction: row-reverse;
  margin: 0 10px 10px 0;
  
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

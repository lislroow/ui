import styled from 'styled-components';

export const Table = styled.table<{ minWidth?: number }>`
  table-layout: fixed;
  width: ${({ width }) => (width ? width + 'px' : '100%')};
  border-top: 1.5px solid #000000;
  font-size: 13px;
  border-spacing: 0px;
  min-width: ${({ minWidth }) => (minWidth ? minWidth + 'px' : '1024px')};

  td.empty {
    font-size: 12px;
    width: 100%;
    padding: 100px 0;
    text-align: center;
    border-bottom: 0.5px solid rgb(125, 125, 125);
    background-color: #fff;
  };
`;

export const ThRow = styled.tr`
  font-size: 14px;
  background-color: hsl(260, 17.60%, 90.00%);
  height: 40px;
  // line-height: 20px;
  white-space: pre;
  text-align: center;

  th {
    // border-left: 1px solid rgb(125, 125, 125);
    border-right: 1px solid rgb(125, 125, 125);
    border-bottom: 1px solid rgb(125, 125, 125);

    &:first-child {
      border-left: none;
    };

    &:last-child {
      border-left: none;
      border-right: none;
    };
  }
`;

export const Tr = styled.tr<{
  pointBackGroundColor?: boolean;
}>`
  background-color: ${({ pointBackGroundColor }) =>
    pointBackGroundColor ? '#fffdeb !important;' : 'white !important;'};
  height: 40px;
  // line-height: 20px;
  white-space: pre;

  td {
    // border-left: 1px solid rgb(125, 125, 125);
    border-right: 1px solid rgb(125, 125, 125);
    border-bottom: 1px solid rgb(125, 125, 125);
    padding: 0 10px;

    &:first-child {
      border-left: none;
    };

    &:last-child {
      border-left: none;
      border-right: none;
    };

    &.sum {
      background-color: hsl(260, 17.60%, 90.00%);
      font-weight: 800;
    };
  };

  &.sum {
    background-color: hsl(260, 17.60%, 90.00%);
    font-weight: 800;
  };

  &.selected td {
    background-color: lightgray;
  };
`;

const shouldForwardProp = (prop: string) => !['textAlign', 'color', 'pointBackGroundColor'].includes(prop);

export const Th = styled.th.withConfig({ shouldForwardProp })<{ textAlign?: string }>`
  text-align: ${({ textAlign }) => (textAlign === 'center' && 'center') || (textAlign === 'right' && 'right')};
  vertical-align: middle;
  font-weight: 800;
  padding: 10px 10px;
  white-space: nowrap;
  border-bottom: 1px solid rgb(125, 125, 125);
`;

export const Td = styled.td.withConfig({ shouldForwardProp })<{ textAlign?: string; color?: string; pointBackGroundColor?: boolean }>`
  text-align: ${({ textAlign }) => (textAlign === 'center' && 'center') || (textAlign === 'right' && 'right')};
  vertical-align: middle;
  padding: 10px 10px;
  background-color: ${({ pointBackGroundColor }) => pointBackGroundColor && 'red !important;'};
  color: ${({ color }) => (color ? color : '#000000')};
  word-wrap: break-word;
  word-break: break-all;
  white-space: break-spaces;

  .border-box td:last-child {
    border-left: 1px solid rgb(125, 125, 125); !important;
    border-right: 1px solid rgb(125, 125, 125); !important;
  };
  
  &.emptyContent {
    width: fit-content();
    height: 200px;
  };

  &> span {
    cursor: pointer;
  };
  &> span:hover {
    text-decoration: underline;
  };
`;

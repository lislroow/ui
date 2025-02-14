import React, { FC } from 'react';
import styled from 'styled-components';
import FormSelect, { SelectItem } from "./FormSelectStyled";
import Loadable from "next/dist/shared/lib/loadable.shared-runtime";

const PageOptionStyled = styled.div`
  display: flex;
  justify-content: end;
  align-content: center;
  align-items: center;
  height: 40px;
  margin-top: 16px;
  margin-bottom: 16px;
  margin: 10px;
  gap: 10px;
`;

export interface PageOptionProps {
  setPageSize?: (pageSize: string) => void;
};
const PageOption: FC<PageOptionProps> = ({ setPageSize }) => {

  const items: SelectItem[] = [3, 5, 10, 15, 30, 50, 100].reduce<SelectItem[]>((acc, item) => {
    acc.push({ label: item+'', value: item+'' });
    return acc;
  }, []);
  items.unshift({ label: '전체', value: '' });

  return (
    <PageOptionStyled>
      <label>보기
        <FormSelect items={items}
          // value={searchParams?.fosCd ?? ''}
          size={`me`} 
          onChange={(e) => setPageSize(e.target.value)}
        />
      </label>
    </PageOptionStyled>
  );
};

export default PageOption;

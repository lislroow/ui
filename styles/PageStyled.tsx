import styled from "styled-components";
import FormSelect, { SelectItem } from "./FormSelectStyled";
import { useEffect, useState } from "react";

export interface PageProps {
  total: number;
  size: number;
  page: number;
  onClick: (page: number, size: number) => void;
  className?: string;
};

interface PageSizeItemType {
  label: string;
  value: number;
};

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
  &> label {
    gap: 10px;
  };
  &> label > select {
    margin: 0 10px;
  };
`;

const Page: React.FC<PageProps> = ({
  total = 0,
  page,
  size,
  onClick,
  ...props
}) => {
  const pageSize = size;
  const numPages = Math.ceil(total / size);
  const pageGroup = Math.ceil((page + 1) / 10);
  const lastNumber = pageGroup * 10 > numPages ? numPages : pageGroup * 10;
  const firstNumber = lastNumber - (10 - 1) > 0 ? lastNumber - (10) : 0;

  const pageEmt = () => {
    const tempList = [];
    for (let i=firstNumber; i<lastNumber; i++) {
      tempList.push(i);
    }
    return tempList;
  };
  const pageList = pageEmt();

  const pageSizeItems: PageSizeItemType[] = [2, 5, 10, 15, 30, 50, 100].reduce<PageSizeItemType[]>((acc, item) => {
    acc.push({ label: item+'', value: item });
    return acc;
  }, []);
  // pageSizeItems.unshift({ label: '전체', value: undefined });

  return (
    <>
      <PageOptionStyled>
        <label>페이지 수
          <FormSelect items={pageSizeItems}
            value={pageSize}
            size={`sm`} 
            onChange={(e) => onClick(page, e.target.value)}
            textAlign="center"
          />
        </label>
      </PageOptionStyled>
    
      <ul className={`pagination`}>
        {(
          <li className="itemBtn prevBtn first pageBtn" onClick={() => onClick((firstNumber-(page % pageSize) < 1 ? 0 : firstNumber+(page % pageSize) - pageSize), pageSize)}>{'◀'}</li>
        )}
        {(
          <li className="itemBtn pageBtn" onClick={() => onClick((page < 1 ? 0 : page-1), pageSize)}>{'◁'}</li>
        )}
        {pageList.map((i) => (
          <li className={`itemBtn ${page === i ? 'active' : ''}`} key={i} onClick={() => onClick(i, pageSize)}>{i+1}</li>
        ))}
        {(
          <li className="itemBtn nextBtn pageBtn" onClick={() => onClick((page + 1 >= numPages ? numPages -1 : page + 1), pageSize)}>{'▷'}</li>
        )}
        {(
          <li className="itemBtn nextBtn last pageBtn" onClick={() => onClick((lastNumber+(page % pageSize) >= numPages ? numPages-1 : lastNumber+(page % pageSize)), pageSize)}>{'▶'}</li>
        )}
      </ul>

      <style jsx>{`
        .pagination {
          gap: 8px;
          display: flex;
          flex-grow: 1;
          justify-content: center;
          margin: 1rem 0 1rem;
        }
        .pagination > .itemBtn {
          background-color: #fff;
          border: 1px solid #dbdbdb;
          color: #bfbfbf;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.3rem;
          cursor: pointer;
        }
        .pagination > .itemBtn.active {
          background-color: #fff;
          border-color: #000;
          color: #000;
        }
        .pagination > .itemBtn.pageBtn {
          color: #000;
          background-color: #fff;
          cursor: pointer;
          font-weight: 800;
        }
      `}</style>
    </>
  );
};

export default Page;

import { useRouter } from "next/router";
import queryString from 'query-string';
import React, { useState, useEffect, useRef } from "react";
import styled, { css } from 'styled-components';

import storeAlert, { showAlert } from "@/redux/store-alert";

import { PageInfoRes, PageSizeOptions } from "@/types/main/CommonTypes";
import {
  ScientistImageSearchReq,
  ScientistImageSearchRes,
} from '@/types/mybatis/ScientistTypes';
import MybatisSampleService from '@/services/mybatis/ScientistService';


const ScientistImages = () => {
  const router = useRouter();
  const { query } = router;
  const scientistImageSearchReqDef: ScientistImageSearchReq = {
    imageDesc: '',
    imageDate: '',
    name: '',
    fosCd: '',
    century: undefined,
    page: 0,
    size: PageSizeOptions[0],
  };
  const [ searchParams, setSearchParams ] = useState<ScientistImageSearchReq>(scientistImageSearchReqDef);
  const [ scientistImageSearchRes, setScientistImageSearchRes ] = useState<ScientistImageSearchRes[]>();
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [ currentIndex, setCurrentIndex ] = useState<number>();
  const [ isSelected, setSelected ] = useState<boolean>(false);
  const [ selectedImage, setSelectedImage ] = useState<ScientistImageSearchRes>();

  const handleSearch = (param?: {name: string, value: any}[]) => {
    param?.forEach(item => {
      if (item.name === 'page') {
        setSearchParams({ ...searchParams, page: item.value });
      } else if (item.name === 'size') {
        setSearchParams({ ...searchParams, size: item.value });
      }
    });

    MybatisSampleService.getScientistImagesSearch(searchParams)
      .then((response) => {
        if ('title' in response.data && 'detail' in response.data) {
          storeAlert.dispatch(
            showAlert({
              title: response.data.title,
              message: response.data.detail,
              details: undefined,
            })
          );
          return;
        }
        setScientistImageSearchRes(response.data.pageData);
      });
  };

  const nextImage = () => {
    const count = scientistImageSearchRes?.length;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % count);
  };
  const prevImage = () => {
    const count = scientistImageSearchRes?.length;
    setCurrentIndex((prevIndex) => (prevIndex - 1) === -1 ? count - 1 : prevIndex - 1);
  };
  const handleSelectImage = (index: number) => {
    setCurrentIndex(index);
  };
  useEffect(() => {
    if (scientistImageSearchRes) {
      setSelectedImage(scientistImageSearchRes[currentIndex]);
      setSelected(true);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (rootRef.current && document.activeElement.contains(rootRef.current)) {
        if (event.key === "ArrowRight") {
          nextImage();
        } else if (event.key === "ArrowLeft") {
          prevImage();
        } else if (event.key === 'Escape') {
          setSelected(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [scientistImageSearchRes]);
  
  return (
    <>
      <SearchArea>
        <SearchGroup $contentAlign="center">
          <SearchRow>
            <label>
              <input type="text" placeholder="name"
                value={searchParams?.name ?? ''}
                onChange={(e) => setSearchParams({
                  ...searchParams,
                  name: e.target.value,
                })}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </label>
          </SearchRow>
        </SearchGroup>
      </SearchArea>

      <ImageArea $isSelected={isSelected} ref={rootRef}>
        <ImageGrid>
          {scientistImageSearchRes && (
              scientistImageSearchRes?.map((item, index) => 
                <img
                  key={index}
                  className={`${currentIndex === index ? 'selected' : ''}`}
                  src={`/static/images/scientist/${item.scientistId}/${item.id}.webp`}
                  draggable="false"
                  alt={`Slide ${index + 1} - ${item.imageDate} - ${item.imageDesc}`}
                  onClick={() => handleSelectImage(index)}
                />
              )
            )
          }
        </ImageGrid>

        <SelectedImage $isSelected={isSelected}>
          <button onClick={() => setSelected(false)}>✖</button>
          {selectedImage && (
            <>
              <img 
                src={`/static/images/scientist/${selectedImage.scientistId}/${selectedImage.id}.webp`}
                alt={`${selectedImage.name} ${selectedImage.id}`}
              />
            </>
          )}
        </SelectedImage>
      </ImageArea>
    </>
  );
}


// image-area
const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); /* 최소 150px 크기로 자동 조정 */
  column-gap: 10px; /* 컬럼 간격 유지 */
  row-gap: 5px; /* 🔹 행 간격 줄이기 */
  justify-content: center;
  align-items: start; /* 🔹 위쪽 정렬 */
  grid-auto-rows: min-content; /* 🔹 행 높이를 내용에 맞게 최소화 */
  transition: width 0.3s ease-in-out;
  margin-left: 10px;

  &> img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: scale(1.01);
    };
    &.selected {
      border: 2px solid cyan;
    };
  };
`;

const SelectedImage = styled.div<{ $isSelected: boolean }>`
  width: 100%;
  height: auto;
  background: white;
  box-shadow: -5px 0 10px rgba(0, 0, 0, 0.2);
  transform: translateX(${({ $isSelected }) => ($isSelected ? "0" : "100%")});
  transition: transform 0.3s ease-in-out;
  display: ${({$isSelected}) => ($isSelected ? 'flex' : 'none')};
  flex-direction: column;
  z-index: 2;
  overflow: hidden;
  margin-right: 10px;

  &> button {
    position: absolute;
    top: 10px;
    right: 10px;
    align-self: flex-end;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  };
  &> img {
    display: block;
  };
`;

const ImageArea = styled.div<{ $isSelected: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isSelected }) => ($isSelected ? "minmax(0, 50%) 1fr" : "1fr 0")};
  width: 100%;
  height: 100%;
  transition: width 0.3s ease-in-out;
  column-gap: 10px;
`;

// search-area
export const SearchArea: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
  return <SearchAreaStyled>{children}</SearchAreaStyled>;
};

const SearchAreaStyled = styled.div`
  display: flex;
  flex-direction: column;
  // padding: 25px 29px;
  background-color: #ffffff;
  border-bottom: 0.5px solid #dbdbdb;
  margin-bottom: 5px;
  width: 100%;
  box-sizing: border-box;
`;

export const SearchGroup = styled.div<{
  wrap?: string;
  mt?: number;
  mb?: number;
  $contentAlign?: 'start' | 'center' | 'end' | 'space-between';
}>`
  display: flex;
  width: 100%;
  flex-wrap: ${({ wrap }) => (wrap ? wrap : 'wrap')};
  flex-direction: row;
  align-items: center;
  color: #555;
  margin-top: ${({ mt }) => (mt ? mt + 'px' : '')};
  margin-bottom: ${({ mb }) => (mb ? mb + 'px' : '0px')};
  justify-content: ${({ $contentAlign }) => ($contentAlign ? $contentAlign : 'start')};
  gap: 0px 25px;
`;

export const SearchRow = styled.div<{ width?: number; marginBoth?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 50px;
  width: ${({ width }) => (width ? width + 'px' : '')};

  &> * {
    margin: 3px 20px;
  };

  &> label > input[type="text"], select {
    height: 24px;
    margin-left: 10px;
    padding: 0 10px;
  };

  &> label > input[type="text"]::placeholder {
    color: lightgray;
  };
  
  ${(props) =>
    !props.marginBoth &&
    css`
      margin-right: 0px !important;
      margin-left: 0px !important;
    `};
`;

export default ScientistImages;

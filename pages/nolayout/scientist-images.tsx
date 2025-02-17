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
  const [ pageInfoRes, setPageInfoRes ] = useState<PageInfoRes>();
  const [ scientistImageSearchRes, setScientistImageSearchRes ] = useState<ScientistImageSearchRes[]>();
  const imageAreaRef = useRef<HTMLDivElement | null>(null)
  const imageGridRef = useRef<HTMLDivElement | null>(null)
  const [ currentIndex, setCurrentIndex ] = useState<number>();
  const [ isSelected, setSelected ] = useState<boolean>(false);
  const [ selectedImage, setSelectedImage ] = useState<ScientistImageSearchRes>();
  const [ columnsPerRow, setColumnsPerRow ] = useState(1);
  const [ isEndOfImage, setEndOfImage ] = useState(false);
  let loading = false;

  const handleSearch = (param?: {name: string, value: any}[]) => {
    let queryParam = Object.keys(searchParams).reduce((obj, key) => {
      if (searchParams[key] !== '' && searchParams[key] !== null) {
        obj[key] = searchParams[key];
      }
      return obj;
    }, {});

    param?.forEach(item => {
      if (item.name === 'page') {
        queryParam = { ...searchParams, page: item.value };
      } else if (item.name === 'size') {
        queryParam = { ...searchParams, size: item.value };
      }
    });

    // console.log(`queryParam=${JSON.stringify(queryParam)}`);
    MybatisSampleService.getScientistImagesSearch(queryParam)
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
        console.log(`loading: ${loading}`);
        if (scientistImageSearchRes) {
          setScientistImageSearchRes([...scientistImageSearchRes, ...response.data.pageData]);
        } else {
          setScientistImageSearchRes([...response.data.pageData]);
        }
        loading = false;
        const pageInfo = response.data.pageInfo;
        setEndOfImage(Math.floor(pageInfo.total / pageInfo.size) === (pageInfo.page + 1));
        setPageInfoRes(pageInfo);
      });
  };

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10 &&
      !loading && !isEndOfImage) {
      console.log("📢 div 끝에 도달! 다음 페이지 조회...");
      loading = true;
      handleSearch([{name: "page", value: (pageInfoRes.page+1)}]);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pageInfoRes]);


  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const handleSelectImage = () => {
    if (scientistImageSearchRes) {
      setSelectedImage(scientistImageSearchRes[currentIndex]);
      setSelected(true);
    }
  };

  useEffect(() => {
    const updateColumnsPerRow = () => {
      if (imageGridRef.current) {
        const gridWidth = imageGridRef.current.clientWidth;
        const columnWidth = 150; // minmax(150px, 1fr) 기준
        const columnCount = Math.floor(gridWidth / columnWidth);
        setColumnsPerRow(columnCount);
      }
    };
    updateColumnsPerRow();
    window.addEventListener("resize", updateColumnsPerRow);
    return () => window.removeEventListener("resize", updateColumnsPerRow);
  }, [isSelected]);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (imageAreaRef.current && document.activeElement.contains(imageAreaRef.current)) {
        if (event.key === "ArrowRight") {
          const count = scientistImageSearchRes?.length;
          setCurrentIndex((prevIndex) => (prevIndex + 1) === count ? prevIndex : prevIndex + 1);
        } else if (event.key === "ArrowLeft") {
          const count = scientistImageSearchRes?.length;
          setCurrentIndex((prevIndex) => (prevIndex - 1) === -1 ? prevIndex : prevIndex - 1);
        } else if (event.key === "ArrowUp") {
          if (currentIndex !== undefined && scientistImageSearchRes) {
            const newIndex = Math.max(currentIndex - columnsPerRow, 0);
            if (Math.floor(currentIndex / columnsPerRow) !== Math.floor(newIndex / columnsPerRow)) {
              setCurrentIndex(newIndex);
            }
          }
        } else if (event.key === "ArrowDown") {
          if (currentIndex !== undefined && scientistImageSearchRes) {
            const newIndex = Math.min(currentIndex + columnsPerRow, scientistImageSearchRes.length - 1);
            if (Math.floor(currentIndex / columnsPerRow) !== Math.floor(newIndex / columnsPerRow)) {
              setCurrentIndex(newIndex);
            }
          }
        } else if (event.key === 'Escape') {
          setSelected(false);
        } else if (event.key === 'Enter') {
          handleSelectImage();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [scientistImageSearchRes, currentIndex, columnsPerRow]);
  
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

      <ImageArea $isSelected={isSelected} ref={imageAreaRef}>
        <ImageGrid ref={imageGridRef}>
          {scientistImageSearchRes && (
              scientistImageSearchRes?.map((item, index) => 
                <img
                  key={index}
                  className={`${currentIndex === index ? 'selected' : ''}`}
                  src={`/static/images/scientist/${item.scientistId}/${item.id}.webp`}
                  draggable="false"
                  alt={`Slide ${index + 1} - ${item.imageDate} - ${item.imageDesc}`}
                  onClick={() => goToImage(index)}
                  onDoubleClick={() => handleSelectImage()}
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
    box-sizing: border-box;

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
    max-width: 100%; /* ✅ 부모 영역보다 커지지 않도록 */
    max-height: 100%; /* ✅ 부모 영역보다 커지지 않도록 */
    object-fit: contain; /* ✅ 이미지가 비율을 유지하면서 가득 차도록 */
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

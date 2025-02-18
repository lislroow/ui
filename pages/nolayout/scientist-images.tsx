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
    size: 3,
  };
  const [ searchParams, setSearchParams ] = useState<ScientistImageSearchReq>(scientistImageSearchReqDef);
  const [ pageInfoRes, setPageInfoRes ] = useState<PageInfoRes>();
  const [ scientistImageSearchRes, setScientistImageSearchRes ] = useState<ScientistImageSearchRes[]>();
  const imageAreaRef = useRef<HTMLDivElement | null>(null)
  const imageGridRef = useRef<HTMLDivElement | null>(null)
  const nameRef = useRef<HTMLInputElement | null>(null)
  const [ currentIndex, setCurrentIndex ] = useState<number>(-1);
  const [ imageHeight, setImageHeight ] = useState<number>();
  const [ imageWidth, setImageWidth ] = useState<number>();
  const [ isSearch, setSearch ] = useState<boolean>(true);
  const [ isSelected, setSelected ] = useState<boolean>(false);
  const [ selectedImage, setSelectedImage ] = useState<ScientistImageSearchRes>();
  const [ isEndOfImage, setEndOfImage ] = useState(false);
  let loading = false;

  const handleSearch = (param?: { name: keyof ScientistImageSearchReq; value: any }[]) => {
    let queryParam: ScientistImageSearchReq = Object.keys(searchParams).reduce(
      (obj, key) => {
        if (searchParams[key] !== '' && searchParams[key] !== null) {
          obj[key] = searchParams[key];
        }
        return obj;
      },
      {} as ScientistImageSearchReq
    );
  
    param?.forEach(item => {
      if (item.name === 'page' || item.name === 'size') {
        queryParam = { ...queryParam, [item.name]: item.value };
      } else {
        return;
      }
    });
  
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

        // console.log(`loading: ${loading}`);
        if (scientistImageSearchRes && loading) {
          setScientistImageSearchRes([...scientistImageSearchRes, ...response.data.pageData]);
        } else {
          setScientistImageSearchRes([...response.data.pageData]);
          if (response.data.pageData?.length > 0) {
            setCurrentIndex(0);
            setSelectedImage(response.data.pageData[0]);
            setSelected(true);
          }
        }
        loading = false;
        const pageInfo = response.data.pageInfo;
        setEndOfImage(pageInfo.total === pageInfo.end);
        // console.log(`pageInfo: ${JSON.stringify(pageInfo)}`);
        setPageInfoRes(pageInfo);
      });
  };

  const handleSelectImage = () => {
    if (scientistImageSearchRes) {
      setSelectedImage(scientistImageSearchRes[currentIndex]);
      setSelected(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const isEndOfScroll = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
      if (isEndOfScroll && !loading && !isEndOfImage) {
        loading = true;
        handleSearch([{name: "page", value: (pageInfoRes.page+1)}]);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pageInfoRes, isEndOfImage]);

  useEffect(() => {
    const updateImageSize = () => {
      setImageHeight(window.innerHeight-200);
      setImageWidth(window.innerWidth-200);
    };
    updateImageSize();
    
    window.addEventListener("resize", updateImageSize);
    return () => window.removeEventListener("resize", updateImageSize);
  }, []);

  useEffect(() => {
    nameRef.current.focus();
  }, [isSearch]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(imageAreaRef.current && document.activeElement.contains(imageAreaRef.current))) {
        return;
      }

      const gridWidth = imageGridRef.current.clientWidth;
      const columnWidth = 150; // minmax(150px, 1fr) 기준
      const columnCount = Math.floor(gridWidth / columnWidth);

      if (event.key === "ArrowRight") {
        const count = scientistImageSearchRes?.length;
        setCurrentIndex((prevIndex) => (prevIndex + 1) === count ? prevIndex : prevIndex + 1);
        if ((currentIndex + 1) === count) {
          if (isEndOfImage) {
            return;
          }
          loading = true;
          handleSearch([{name: "page", value: (pageInfoRes.page+1)}]);
        }
      } else if (event.key === "ArrowLeft") {
        setCurrentIndex((prevIndex) => (prevIndex - 1) === -1 ? prevIndex : prevIndex - 1);
      } else if (event.key === "ArrowUp") {
        const newIndex = Math.max(currentIndex - columnCount, 0);
        if (Math.floor(currentIndex / columnCount) !== Math.floor(newIndex / columnCount)) {
          setCurrentIndex(newIndex);
        }
      } else if (event.key === "ArrowDown") {
        const newIndex = Math.min(currentIndex + columnCount, scientistImageSearchRes.length - 1);
        // console.log(`columnCount: ${columnCount}, currentIndex: ${currentIndex}, newIndex: ${newIndex}`);
        if (Math.floor(currentIndex / columnCount) !== Math.floor(newIndex / columnCount)) {
          setCurrentIndex(newIndex);
        }
        // console.log(`newIndex: ${newIndex}, scientistImageSearchRes.length: ${scientistImageSearchRes.length - 1}`);
        if (newIndex === scientistImageSearchRes.length - 1) {
          if (isEndOfImage) {
            return;
          }
          loading = true;
          // console.log(`pageInfoRes.page: ${pageInfoRes.page}`);
          handleSearch([{name: "page", value: (pageInfoRes.page+1)}]);
        }
      } else if (event.key === 'Escape') {
        setSearch((prev) => !prev);
      } else if (event.key === 'Enter') {
        handleSelectImage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, pageInfoRes, isEndOfImage]);
  
  return (
    <>
      <SearchArea style={{display: `${isSearch ? 'block' : 'none'}`}}>
        <SearchGroup $contentAlign="center">
          <SearchRow>
            <label>
              <input type="text" placeholder="name"
                ref={nameRef}
                value={searchParams?.name ?? ''}
                onChange={(e) => setSearchParams({
                  ...searchParams,
                  name: e.target.value,
                })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  } else if (e.key === 'Escape') {
                    setSearch((prev) => !prev);
                  }
                }}
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
                  onClick={() => setCurrentIndex(index)}
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
                style={{height: `${imageHeight > imageWidth ? 'auto' : imageHeight}px`,
                  width: `${imageWidth > imageHeight ? 'auto' : imageWidth}px`, }}
              />
              <div style={{display: 'flex', gap: '10px'}}>
                <div>
                {`${selectedImage.birthYear} - ${selectedImage.deathYear}`}
                </div>
                <div>{selectedImage.name}</div>
              </div>
              <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                <div style={{margin: '0 20px'}}>{selectedImage.imageDate}</div>
              </div>
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
  width: calc(50% - 30px);
  height: auto;
  background: white;
  box-shadow: -5px 0 10px rgba(0, 0, 0, 0.2);
  transform: translateX(${({ $isSelected }) => ($isSelected ? "0" : "100%")});
  transition: transform 0.3s ease-in-out;
  display: ${({$isSelected}) => ($isSelected ? 'flex' : 'none')};
  flex-direction: column;
  z-index: 2;
  overflow: hidden;
  right: 10px;
  position: fixed;
  justify-content: center;
  align-items: center;

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
    // max-width: 100%; /* ✅ 부모 영역보다 커지지 않도록 */
    // max-height: 100%; /* ✅ 부모 영역보다 커지지 않도록 */
    object-fit: contain; /* ✅ 이미지가 비율을 유지하면서 가득 차도록 */
    // width: 400px;
    // margin: 10px;
  };
`;

const ImageArea = styled.div<{ $isSelected: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isSelected }) => ($isSelected ? "minmax(0, 50%) 1fr" : "1fr 0")};
  width: 100%;
  height: 100%;
  transition: width 0.3s ease-in-out;
  column-gap: 30px;
`;

// search-area
const SearchArea = styled.div`
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

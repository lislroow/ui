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
    size: 16,
  };
  const [ searchParams, setSearchParams ] = useState<ScientistImageSearchReq>(scientistImageSearchReqDef);
  const [ pageInfoRes, setPageInfoRes ] = useState<PageInfoRes>();
  const [ scientistImageSearchRes, setScientistImageSearchRes ] = useState<ScientistImageSearchRes[]>();
  const imageAreaRef = useRef<HTMLDivElement | null>(null)
  const imageGridRef = useRef<HTMLDivElement | null>(null)
  const nameRef = useRef<HTMLInputElement | null>(null)
  const [ currentIndex, setCurrentIndex ] = useState<number>(-1);
  const [ isSearch, setSearch ] = useState<boolean>(true);
  const [ isSelected, setSelected ] = useState<boolean>(false);
  const [ selectedImage, setSelectedImage ] = useState<ScientistImageSearchRes>();
  const [ isEndOfImage, setEndOfImage ] = useState(false);
  let loading = false;

  const spliterRef = useRef<HTMLDivElement | null>(null);
  const [ gridWidth, setGridWidth ] = useState(400);
  const [ isDragging, setIsDragging ] = useState(false);
  


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
          }
        }
        loading = false;
        const pageInfo = response.data.pageInfo;
        setEndOfImage(pageInfo.total === pageInfo.end);
        // console.log(`pageInfo: ${JSON.stringify(pageInfo)}`);
        setPageInfoRes(pageInfo);
      });
  };
  
  // Drag and Drop
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
  };

  const throttle = (func: (...args: any[]) => void, delay: number) => {
    let lastCall = 0;
    return (...args: any[]) => {
      const now = new Date().getTime();
      if (now - lastCall < delay) return;
      lastCall = now;
      func(...args);
    };
  };

  const handleMouseMove = throttle((e: MouseEvent) => {
    if (!isDragging || !spliterRef.current) return;
    setGridWidth(e.clientX < 150 ? 150 : e.clientX);
  }, 5);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

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
    nameRef.current.focus();
  }, [isSearch]);

  useEffect(() => {
    if (isSelected) {
      handleSelectImage();
    }
  }, [currentIndex]);

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
        setSelected(false);
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
                onKeyDown={(e) => {e.key === 'Enter' && handleSearch()}}
              />
            </label>
          </SearchRow>
        </SearchGroup>
      </SearchArea>

      <ImageArea $isSelected={isSelected} $gridWidth={gridWidth} ref={imageAreaRef}>
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

        <Spliter $isSelected={isSelected} ref={spliterRef} onMouseDown={handleMouseDown} />
        
        <SelectedImage $isSelected={isSelected} $gridWidth={gridWidth}>
          <button onClick={() => setSelected(false)}>✖</button>
          {selectedImage && (
            <>
              <img 
                src={`/static/images/scientist/${selectedImage.scientistId}/${selectedImage.id}.webp`}
                alt={`${selectedImage.name} ${selectedImage.id}`}
              />
              <div style={{display: 'grid', gridTemplateRows: '20px 20px'}}>
                <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                  <div>{selectedImage.imageDate}</div>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                  <div>
                  {`${selectedImage.birthYear} - ${selectedImage.deathYear}`}
                  </div>
                  <div>{selectedImage.name}</div>
                </div>
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
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  justify-content: center;
  align-items: start;
  grid-auto-rows: min-content;
  transition: width 0.3s ease-in-out;
  overflow-y: auto;
  height: calc(100vh - 40px);
  user-select: none;

  &::-webkit-scrollbar {
    width: 6px;
  };
  &::-webkit-scrollbar-thumb {
    background-color: #efefef;
    border-radius: 4px;
  };
  &::-webkit-scrollbar-thumb:hover {
    background-color: #dfdfdf;
    width: 8px;
  };

  &> img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
    box-sizing: border-box;
    padding: 5px;

    &:hover {
      // transform: scale(1.01);
    };
    &.selected {
      // border: 2px solid cyan;
      outline: 2px solid cyan;
      outline-offset: -7px;
    };
  };
`;

const Spliter = styled.div<{$isSelected: boolean}>`
  width: 10px;
  // background: #ddd;
  border-left: 6px solid #ddd;
  // border-right: 4px solid #ddd;
  cursor: ew-resize;
  transition: background 0.3s;
  height: calc(100vh - 40px);
  display: ${({$isSelected}) => ($isSelected ? 'block' : 'none')};

  &:hover {
    // background: #aaa;
    border-left: 6px solid #aaa;
    // border-right: 4px solid #aaa;
  };
`;

const SelectedImage = styled.div<{ $isSelected: boolean, $gridWidth: number }>`
  background: white;
  // box-shadow: -5px 0 10px rgba(0, 0, 0, 0.2);
  transform: translateX(${({ $isSelected }) => ($isSelected ? "0" : "100%")});
  transition: transform 0.3s ease-in-out;
  display: ${({$isSelected}) => ($isSelected ? 'grid' : 'none')};
  grid-template-rows: 1fr 60px;
  justify-content: center;
  align-items: center;
  max-height: calc(100vh - 60px);

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
    user-select: none;
    max-height: calc(100vh - 160px);
    max-width: ${({ $gridWidth }) => (`calc(100vw - ${$gridWidth+20}px)`)}
  };
`;

const ImageArea = styled.div<{ $isSelected: boolean, $gridWidth: number }>`
  display: grid;
  grid-template-columns: ${({ $isSelected, $gridWidth }) => ($isSelected ? `${$gridWidth}px 10px 1fr` : "1fr 0 0")};
  width: 100%;
  height: 100%;
  transition: width 0.3s ease-in-out;
  column-gap: 3px;
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

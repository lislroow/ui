import { useRouter } from "next/router";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from 'styled-components';

import storeAlert, { showAlert } from "@/redux/store-alert";

import { PageInfoRes } from "@/types/main/CommonTypes";
import {
  ScientistImageSearchReq,
  ScientistImageSearchRes,
} from '@/types/mybatis/ScientistTypes';
import MybatisSampleService from '@/services/mybatis/ScientistService';
import queryString from "query-string";


const ScientistImages = () => {
  const router = useRouter();
  const searchParamDef: ScientistImageSearchReq = {
    imageDesc: '',
    imageDate: '',
    name: '',
    fosCd: '',
    century: undefined,
    page: 0,
    size: 50,
  };
  const [ searchParams, setSearchParams ] = useState<ScientistImageSearchReq>(searchParamDef);
  const [ pageInfo, setPageInfo ] = useState<PageInfoRes>();
  const [ imageList, setImageList ] = useState<ScientistImageSearchRes[]>();
  const nameRef = useRef<HTMLInputElement | null>();
  const imageAreaRef = useRef<HTMLDivElement | null>(null);
  const imageGridRef = useRef<HTMLDivElement | null>(null);
  const spliterRef = useRef<HTMLDivElement | null>(null);
  const [ imageGridWidth, setImageGridWidth ] = useState(400);
  const [ isDragging, setIsDragging ] = useState(false);
  const [ currentIndex, setCurrentIndex ] = useState<number>(-1);
  const [ selectedImage, setSelectedImage ] = useState<ScientistImageSearchRes>();
  const [ isSelected, setSelected ] = useState<boolean>(false);
  const [ isEndOfImage, setEndOfImage ] = useState(false);
  const imageUnitWidth = 150;
  let loading = false;

  const handleImageSelect = (selected: boolean) => {
    setSelected(selected);
    if (imageList && selected) {
      setSelectedImage(imageList[currentIndex]);
    }
  };
  
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
      queryParam = { ...queryParam, [item.name]: item.value };
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
        
        if (response.data.pageData?.length > 0) imageAreaRef.current.focus();

        if (imageList && loading) {
          setImageList([...imageList, ...response.data.pageData]);
        } else {
          setImageList([...response.data.pageData]);
          if (response.data.pageData?.length > 0) {
            setCurrentIndex(0);
            setSelectedImage(response.data.pageData[0]);
          } else {
            setCurrentIndex(-1);
            setSelectedImage(undefined);
          }
        }
        loading = false;
        const pageInfo = response.data.pageInfo;
        setEndOfImage(pageInfo.total === pageInfo.end);
        setPageInfo(pageInfo);
      });
  };

  useEffect(() => {
    if (router.isReady) {
      const parsedParams = {
        name: Array.isArray(router.query.name) ? router.query.name[0] : router.query.name || '',
      }
      setSearchParams(prev => ({
        ...prev,
        ...parsedParams,
      }));
      handleSearch([{ name: "name", value: parsedParams.name }]);
    }
  }, [router.isReady, router.query.name]);

  const handleRouteAndSearch = () => {
    const queryParam = Object.keys(searchParams).reduce((obj, key) => {
      if (searchParams[key] !== '' && searchParams[key] !== null) {
        obj[key] = searchParams[key];
      }
      return obj;
    }, {});
    router.push({
      query: queryString.stringify(queryParam),
    });
  };

  useEffect(() => {
    if (isSelected) {
      setSelectedImage(imageList[currentIndex]);
    }
  }, [currentIndex]);

  const throttle = (func: (...args: any[]) => void, delay: number) => {
    let lastCall = 0;
    return (...args: any[]) => {
      const now = new Date().getTime();
      if (now - lastCall < delay) return;
      lastCall = now;
      func(...args);
    };
  };

  // 'Spliter' Mouse Drag and Drop Event
  useEffect(() => {
    const handleMouseMove = throttle((e: MouseEvent) => {
      if (!isDragging || !spliterRef.current) return;
      setImageGridWidth(e.clientX < imageUnitWidth ? imageUnitWidth : e.clientX);
    }, 5);

    const handleMouseUp = () => {
      setIsDragging(false);
    };

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

  // 'ImageGrid' Y-Scroll Event
  useEffect(() => {
    const handleScroll = throttle(() => {
      const isEndOfScroll = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
      if (isEndOfScroll && !loading && !isEndOfImage) {
        loading = true;
        handleSearch([{name: "page", value: (pageInfo.page+1)}]);
      }
    }, 100);
    
    imageGridRef.current?.addEventListener("scroll", handleScroll);
    return () => {
      imageGridRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [pageInfo, isEndOfImage]);

  // 'ImageGrid' Keyboard ArrowKeys Event
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(imageAreaRef.current && document.activeElement.contains(imageAreaRef.current))) {
        return;
      }

      const columnCount = Math.floor(imageGridRef.current.clientWidth / imageUnitWidth);

      if (event.key === "ArrowRight") {
        const count = imageList?.length;
        setCurrentIndex((prevIndex) => (prevIndex + 1) === count ? prevIndex : prevIndex + 1);
        if ((currentIndex + 1) === count) {
          if (isEndOfImage) {
            return;
          }
          if (!loading) {
            loading = true;
            handleSearch([{name: "page", value: (pageInfo.page+1)}]);
          }
        }
      } else if (event.key === "ArrowLeft") {
        setCurrentIndex((prevIndex) => (prevIndex - 1) === -1 ? prevIndex : prevIndex - 1);
      } else if (event.key === "ArrowUp") {
        const newIndex = Math.max(currentIndex - columnCount, 0);
        if (Math.floor(currentIndex / columnCount) !== Math.floor(newIndex / columnCount)) {
          setCurrentIndex(newIndex);
        }
      } else if (event.key === "ArrowDown") {
        const newIndex = Math.min(currentIndex + columnCount, imageList.length - 1);
        if (Math.floor(currentIndex / columnCount) !== Math.floor(newIndex / columnCount)) {
          setCurrentIndex(newIndex);
        }
        if (newIndex === imageList.length - 1) {
          if (isEndOfImage) {
            return;
          }
          if (!loading) {
            loading = true;
            handleSearch([{name: "page", value: (pageInfo.page+1)}]);
          }
        }
      } else if (event.key === 'Escape') {
        handleImageSelect(false);
      } else if (event.key === 'Enter') {
        // setSelected((prev) => !prev);
        handleImageSelect(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, pageInfo, isEndOfImage]);
  
  return (
    <>
      <SearchArea>
        <div className="search-row">
          <label>
            <input type="text" placeholder="name"
              ref={useCallback(
                (node: HTMLInputElement) => {
                  nameRef.current = node;
                  nameRef.current?.focus();
                }, [])}
              value={searchParams?.name ?? ''}
              onChange={(e) => setSearchParams({
                ...searchParams,
                name: e.target.value,
              })}
              onKeyDown={(e) => {e.key === 'Enter' && handleRouteAndSearch()}}
            />
          </label>
        </div>
      </SearchArea>

      <ImageArea ref={imageAreaRef} tabIndex={0} $isSelected={isSelected} $imageGridWidth={imageGridWidth}>
        <ImageGrid ref={imageGridRef}>
          {imageList && (
              imageList?.map((item, index) => 
                <img
                  key={index}
                  className={`${currentIndex === index ? 'selected' : ''}`}
                  src={`/static/images/scientist/${item.scientistId}/${item.id}.webp`}
                  draggable="false"
                  alt={`Slide ${index + 1} - ${item.imageDate} - ${item.imageDesc}`}
                  onClick={() => setCurrentIndex(index)}
                  onDoubleClick={() => handleImageSelect(true)}
                />
              )
            )
          }
        </ImageGrid>

        <Spliter ref={spliterRef} className={`${isSelected ? 'show':''}`} onMouseDown={() => setIsDragging(true)} />
        
        <SelectedImage $isSelected={isSelected} $imageGridWidth={imageGridWidth}>
          {selectedImage && (
            <>
              <button onClick={() => handleImageSelect(false)}>✖</button>
              <img 
                src={`/static/images/scientist/${selectedImage.scientistId}/${selectedImage.id}.${selectedImage.format}`}
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

// search-area
const SearchArea = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-bottom: 0.5px solid #dbdbdb;
  margin-bottom: 5px;
  width: 100%;
  box-sizing: border-box;

  &> .search-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-right: 50px;
  };
  
  &> .search-row > * {
    margin: 3px 20px;
  };
  
  &> .search-row > label > input[type="text"], select {
    height: 24px;
    margin-left: 10px;
    padding: 0 10px;
  };

  &> .search-row > label > input[type="text"]::placeholder {
    color: lightgray;
  };
`;


// image-area
const ImageArea = styled.div<{ $isSelected: boolean, $imageGridWidth: number }>`
  display: grid;
  grid-template-columns: ${({ $isSelected, $imageGridWidth }) => ($isSelected ? `${$imageGridWidth}px 10px 1fr` : "1fr 0 0")};
  width: 100%;
  height: 100%;
  transition: width 0.3s ease-in-out;
  column-gap: 3px;
  &:focus {
    outline: none;
  };
`;

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
    background-color: #f8f8f8;
    border-radius: 4px;
  };
  &::-webkit-scrollbar-thumb:hover {
    background-color: #8f8f8f;
    width: 8px;
  };

  &> img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 15px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
    box-sizing: border-box;
    padding: 2px;

    &.selected {
      outline: 6px solid cyan;
      outline-offset: -3px;
    };
  };
`;

const Spliter = styled.div`
  width: 10px;
  border-left: 6px solid #ddd;
  cursor: ew-resize;
  transition: background 0.3s;
  height: calc(100vh - 40px);
  display: none;

  &.show {
    display: block;
  };
  &:hover {
    border-left: 6px solid #aaa;
  };
`;

const SelectedImage = styled.div<{ $isSelected: boolean, $imageGridWidth: number }>`
  background: white;
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
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  };
  &> img {
    display: block;
    user-select: none;
    max-height: calc(100vh - 160px);
    max-width: ${({ $imageGridWidth }) => (`calc(100vw - ${$imageGridWidth+20}px)`)}
  };
`;

export default ScientistImages;

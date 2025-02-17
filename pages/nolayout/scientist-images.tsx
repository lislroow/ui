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
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextImage = () => {
    const count = scientistImageSearchRes?.length;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % count);
  };
  const prevImage = () => {
    const count = scientistImageSearchRes?.length;
    setCurrentIndex((prevIndex) => (prevIndex - 1) === -1 ? count - 1 : prevIndex - 1);
  };
  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

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
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (rootRef.current && document.activeElement.contains(rootRef.current)) {
        if (event.key === "ArrowRight") {
          nextImage();
        } else if (event.key === "ArrowLeft") {
          prevImage();
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
        <SearchGroup contentAlign="center">
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
      {scientistImageSearchRes && (
        <DetailCardStyled ref={rootRef}>
          <div className="card-image">
            {scientistImageSearchRes && (
                scientistImageSearchRes?.map((item, index) => (
                  <React.Fragment key={index}>
                    <SlideImage
                      key={index}
                      src={`/static/images/scientist/${item.scientistId}/${item.id}.webp`}
                      $isActive={index === currentIndex}
                      draggable="false"
                      alt={`Slide ${index + 1} - ${item.imageDate} - ${item.imageDesc}`}
                    />
                    
                    {[`${item.name}`,
                      `${item.birthYear} - ${item.deathYear} ${item.imageDate ? '('+item.imageDate+')' : ''}`,
                      ]
                      .map((item, _idx) => (
                        <div key={_idx}
                          className={`card-image-text-top ${index === currentIndex ? 'active' : ''}`}
                          style={{top: `${20 * (_idx) + 5}px`}}>
                          {item}
                        </div>
                    ))}
                  </React.Fragment>
                ))
              )
            }

            {scientistImageSearchRes?.length > 1 && (
              <IndicatorContainer>
                {scientistImageSearchRes?.map((_, idx) => (
                  <Indicator
                    key={idx}
                    $isActive={idx === currentIndex}
                    onClick={() => goToImage(idx)}
                  />
                ))}
              </IndicatorContainer>
            )}

          </div>
        </DetailCardStyled>
      )}
    </>
  );
}


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


// image-area
const DetailCardStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: inherit;
  overflow: hidden;

  .card-image {
    overflow: hidden; // 초과 영역 숨김
    border-radius: 8px;
    // display: flex;
    display: inline-block; /* 🔹 이미지 크기에 맞춰 부모 크기 자동 조정 */
    max-width: 100%;
    max-height: 100%;
    align-items: center;
    justify-content: center;
    position: relative;
  };
  .card-image-text-top {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0%);
    color: rgb(186, 234, 251);
    // background-color: black;
    background: linear-gradient(to right, black 0%, black 100%);
    white-space: nowrap;
    user-select: text;
    display: none;
    z-index: 1;

    &.active {
      display: block;
    };
  };
  .card-image-text-bottom {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0%);
    color: rgb(186, 234, 251);
    // background-color: black;
    background: linear-gradient(to right, black 0%, black 100%);
    white-space: nowrap;
    user-select: text;
    display: none;

    &.active {
      display: block;
    };
  };
`;

const SlideImage = styled.img<{ $isActive: boolean }>`
  transition: opacity 0.5s ease-in-out;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0)}; // 🔹 투명도 조절
  display: ${({ $isActive }) => ($isActive ? "block" : "none")}; // 🔹 안 보이게 설정
  position: relative;
  // width: 250px;
  // height: auto;
  width: auto;
  height: auto;
  max-width: 100%; // 🔹 부모 너비 초과 방지
  max-height: 100%; // 🔹 부모 높이 초과 방지
  object-fit: contain; // 🔹 스크롤 없이 비율 유지하며 크기 조정
`;

const IndicatorContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  // bottom: 10px;
  top: 10px;
  width: 100%;
`;

const Indicator = styled.div<{ $isActive: boolean }>`
  width: 10px;
  height: 10px;
  margin: 0 5px;
  background-color: ${({ $isActive }) => ($isActive ? "white" : "gray")};
  border-radius: 50%;
  cursor: pointer;
`;

export default ScientistImages;

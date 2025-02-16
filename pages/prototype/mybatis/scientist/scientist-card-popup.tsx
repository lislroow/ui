import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import storeAlert, { showAlert } from "@/redux/store-alert";

import {
  ScientistSearchRes,
} from '@/types/mybatis/ScientistTypes';
import MybatisSampleService from '@/services/mybatis/ScientistService';

interface ScientistCardPopupProps {
  id: number;
}

const ScientistCardPopup: React.FC<ScientistCardPopupProps> = ({id}) => {
  const [ scientistSearchRes, setScientistSearchRes ] = useState<ScientistSearchRes>();
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextImage = () => {
    const count = scientistSearchRes?.images?.length;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % count);
  };
  const prevImage = () => {
    const count = scientistSearchRes?.images?.length;
    setCurrentIndex((prevIndex) => (prevIndex - 1) === -1 ? count - 1 : prevIndex - 1);
  };
  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const init = async () => {
  }
  
  useEffect(() => {
    init();

    id && MybatisSampleService.getScientist(id)
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
        setScientistSearchRes(response.data);
      });
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (rootRef.current && document.activeElement.contains(rootRef.current)) {
        if (event.key === "ArrowRight") {
          nextImage();
        } else if (event.key === "ArrowLeft") {
          prevImage();
        } else if (event.key === "Enter") {
          const {scientistId, id} = scientistSearchRes.images[currentIndex];
          window.open(`/static/images/scientist/${scientistId}/${id}.webp`, "_blank", "noopener,noreferrer");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [scientistSearchRes]);
  
  return (
    <>
      {scientistSearchRes && (
        <DetailCardStyled ref={rootRef}>
          <div className="card-image">
            {scientistSearchRes?.images && (
                scientistSearchRes?.images?.map((image, image_idx) => (
                  <React.Fragment key={image_idx}>
                    <SlideImage
                      key={image_idx}
                      src={`/static/images/scientist/${image.scientistId}/${image.id}.webp`}
                      $isActive={image_idx === currentIndex}
                      draggable="false"
                      alt={`Slide ${image_idx + 1} - ${image.imageDate} - ${image.imageDesc}`}
                    />
                    
                    {[`${scientistSearchRes?.name}`,
                      `${scientistSearchRes?.birthYear} - ${scientistSearchRes?.deathYear} ${image.imageDate ? '('+image.imageDate+')' : ''}`,
                      ]
                      .reverse()
                      .map((item, text_idx) => (
                        <div key={`${image_idx }-bottom-${text_idx}`}
                          className={`card-image-text-bottom ${image_idx === currentIndex ? 'active' : ''}`}
                          style={{bottom: `${20 * (text_idx) + 5}px`}}>
                          {item}
                        </div>
                    ))}
                  </React.Fragment>
                ))
              )
            }

            {/* <NextButton onClick={nextImage}>{">"}</NextButton> */}

            {scientistSearchRes?.images?.length > 1 && (
              <IndicatorContainer>
                {scientistSearchRes?.images?.map((_, idx) => (
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

const DetailCardStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: inherit;

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
  width: 250px;
  height: auto;
`;

// const NextButton = styled.button`
//   position: absolute;
//   top: 50%;
//   right: 10px;
//   transform: translateY(-50%);
//   background: rgba(0, 0, 0, 0.5);
//   color: white;
//   border: none;
//   padding: 5px 10px;
//   cursor: pointer;
//   border-radius: 5px;
// `;

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

export default ScientistCardPopup;

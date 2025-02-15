import { useState, useEffect } from "react";

import storeAlert, { showAlert } from "@/redux/store-alert";

import {
  ScientistSearchRes,
  ScientistModifyReq,
} from '@/types/mybatis/ScientistTypes';
import MybatisSampleService from '@/services/mybatis/ScientistService';
import styled from "styled-components";
import Image from "next/image";

interface ScientistDetailCardProps {
  id: number;
}

const ScientistDetailCard: React.FC<ScientistDetailCardProps> = ({id}) => {
  const [ scientistSearchRes, setScientistSearchRes ] = useState<ScientistSearchRes>();
  const [ scientistModifyReq, setScientistModifyReq ] = useState<ScientistModifyReq>({
    id: null,
    name: null,
    birthYear: null,
    deathYear: null,
    fosCd: null,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "/images/5.webp",
    "/images/5-1940.webp"
  ];

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
    if (scientistSearchRes) {
      setScientistModifyReq(Object.keys(scientistSearchRes).reduce((acc, key) => {
        let value = scientistSearchRes[key];
        if (key in scientistModifyReq) {
          acc[key] = value;
        }
        return acc;
      }, {} as ScientistModifyReq));
    }
  }, [scientistSearchRes]);
  
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };
  
  return (
    <DetailCardStyled>
      <div className="card-image">
        {images.map((src, idx) => (
          <SlideImage
            key={idx}
            src={src}
            width={240}
            height={300}
            $isActive={idx === currentIndex}
            draggable="false"
            layout="intrinsic"
            alt={`Slide ${idx + 1}`}
          />
          // <Image key={idx} src={src} className={`card-image-item`} width={240} height={0} layout="intrinsic" objectFit="cover" style={{borderRadius: 'inherit'}} alt="img" />
        ))}

        <PrevButton onClick={prevImage}>{"<"}</PrevButton>
        <NextButton onClick={nextImage}>{">"}</NextButton>

        <IndicatorContainer>
          {images.map((_, idx) => (
            <Indicator
              key={idx}
              $isActive={idx === currentIndex}
              onClick={() => goToImage(idx)}
            />
          ))}
        </IndicatorContainer>

        {[`${scientistSearchRes?.name}`, `${scientistSearchRes?.birthYear} - ${scientistSearchRes?.deathYear}`]
          .map((item, index) => (
            <div key={index} className="card-image-text" style={{bottom: `${20 * (index+1)}px`}}>
              {item}
            </div>
          ))}
      </div>
    </DetailCardStyled>
  );
}

const DetailCardStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: inherit;

  .card-image {
    // width: 240px;
    // height: 300px;
    overflow: hidden; // 초과 영역 숨김
    border-radius: 8px;
    // display: flex;
    display: inline-block; /* 🔹 이미지 크기에 맞춰 부모 크기 자동 조정 */
    max-width: 100%; /* 🔹 부모 크기가 너무 커지는 것 방지 */
    max-height: 100%;
    align-items: center;
    justify-content: center;
    position: relative;
  };
  .card-image-text {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0%);
    color: rgb(124, 255, 146);
    white-space: nowrap;
  };
`;

const SlideImage = styled(Image)<{ $isActive: boolean }>`
  // position: absolute;
  // width: 100%;
  width: auto; /* 🔹 원본 크기 유지 */
  height: auto;
  max-width: 100%; /* 🔹 부모 크기에 맞춰 조정 */
  max-height: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease-in-out;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0)}; // 🔹 투명도 조절
  display: ${({ $isActive }) => ($isActive ? "block" : "none")}; // 🔹 안 보이게 설정
`;

const PrevButton = styled.button`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
`;

const NextButton = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
`;

const IndicatorContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 10px;
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


export default ScientistDetailCard;

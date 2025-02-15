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
  
  
  return (
    <DetailCardStyled>
      <div className="card-image">
        <Image src="/images/5.webp" width={240} height={0} layout="intrinsic" objectFit="cover" style={{borderRadius: 'inherit'}} alt="img" />
        {[`${scientistSearchRes?.name}`, `${scientistSearchRes?.birthYear} - ${scientistSearchRes?.deathYear}`]
          .map((item, index) => (
            <div className="card-image-text" style={{bottom: `${20 * (index+1)}px`}}>
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
    width: 100%;
    height: 100%;
    overflow: hidden; // 초과 영역 숨김
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  };
  .card-image-text {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0%);
    color: rgb(124, 255, 146);
    white-space: nowrap;
  };
`;

export default ScientistDetailCard;

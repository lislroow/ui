import { useState, useEffect } from "react";

import {
  ScientistSearchRes,
} from '@/types/mybatis/ScientistTypes';
import { Table, Td, Th, ThRow, Tr } from "@/styles/TableStyled";

interface ScientistComparePopupProps {
  dataList: ScientistSearchRes[];
}

const ScientistComparePopup: React.FC<ScientistComparePopupProps> = ({dataList}) => {
  const [ tableWidth, setTableWidth ] = useState<number>();
  const [ compareFields, setCompareFields ] = useState<{label: string; key: string;}[]>([
    // {label: 'id', key: 'id'},
    // {label: 'name', key: 'name'},
    {label: 'year of birth', key: 'birthYear'},
    {label: 'year of death', key: 'deathYear'},
    {label: 'field of study', key: 'fosNm'},
  ]);
  
  
  useEffect(() => {
    const cnt = dataList?.length > 0 ? dataList?.length : 0;
    setTableWidth(100 + (cnt * 100));
  }, [dataList]);
  
  return (
    <Table width={tableWidth} minWidth={tableWidth} style={{userSelect: "text"}}>
      <colgroup>
        <col />
        {dataList?.map((_, index) => (
          <col key={`${index}`} width="100px" />
        ))}
      </colgroup>
      <thead>
        <ThRow>
          <Th></Th>
          {dataList?.map((item, index) => (
            <Th key={index} style={{wordWrap: "break-word", maxWidth: '100px', whiteSpace: 'normal'}} textAlign="left">{`${item.id}. ${item.name}`}</Th>
          ))}
        </ThRow>
      </thead>
      <tbody>
        {compareFields?.map((item, idx) => (
          <Tr key={idx}>
            <Td key={idx}>{item.label}</Td>
            {dataList?.map((data, index) => (
              <Td key={`${index}`} textAlign="center">{data[item.key]}</Td>
            ))}
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ScientistComparePopup;

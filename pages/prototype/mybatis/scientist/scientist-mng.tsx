import { useRouter } from "next/router";
import queryString from 'query-string';
import { useEffect, useState } from "react";

import FormSelect, { SelectItem } from "@/styles/FormSelectStyled";
import { ButtonGroup, SearchArea, SearchGroup, SearchRow } from "@/styles/SearchArea";
import { Table, Td, Tr, Th, ThRow } from "@/styles/TableStyled";
import Page from "@/styles/PageStyled";
import DetailPopup from "@/components/popup/DetailPopup";
import ScientistDetailForm from "@/popup/prototype/mybatis/scientist/scientist-form-popup";
import ScientistDetailCard from "@/popup/prototype/mybatis/scientist/scientist-card-popup";

import { PageInfoRes, PageSizeOptions } from "@/types/main/CommonTypes";
import { ScientistSearchReq, ScientistSearchRes } from "@/types/mybatis/ScientistTypes";

import CodeService from "@/services/main/CodeService";
import ScientistService from "@/services/mybatis/ScientistService";
import { CheckedArea } from "@/styles/CheckedArea";
interface ScientistData extends ScientistSearchRes {
  checked: boolean;
}

const ScientistMng = () => {
  const router = useRouter();
  const { query } = router;
  const [ codeFOS, setCodeFOS ] = useState<SelectItem[]>();
  const [ codeCentury, setCodeCentury ] = useState<SelectItem[]>();
  const searchScientistReqDef: ScientistSearchReq = {
    name: '',
    fosCd: '',
    century: undefined,
    page: 0,
    size: PageSizeOptions[0],
  };
  const [ searchParams, setSearchParams ] = useState<ScientistSearchReq>(searchScientistReqDef);
  const [ pageInfoRes, setPageInfoRes ] = useState<PageInfoRes>();
  const [ scientistDataList, setScientistDataList ] = useState<ScientistData[]>([]);

  const [ detailFormPopups, setDetailFormPopups ] = useState<{ id: number, top: number, left: number }[]>([]);
  const [ detailCardPopups, setDetailCardPopups ] = useState<{ id: number, top: number, left: number }[]>([]);

  const init = async () => {
    setCodeFOS(CodeService.getFormSelectItem('scientist:fos'));
    let codes: SelectItem[] = [];
    for (let i=20; i>14; i--) {
      codes.push({
        label: `${i}세기`,
        value: (i) + '',
      });
    }
    codes.unshift({
      label: '- all -',
      value: '',
    });
    setCodeCentury(codes);
  };

  const handleCompare = () => {
    const list = scientistDataList.filter((item) => item.checked);
    list?.length > 0 && detailFormPopups.forEach((item) => handleDetailFormClose(item.id));
    list.forEach((item, index) => {
      setDetailFormPopups((prev) => [
        ...prev,
        { id: item.id, title: `${item.name}`, top: 0, left: 0 }
      ]);
    });
  };

  const toggleRowChecked = (id: number) => {
    setScientistDataList(scientistDataList.map((item) => {
      if (item.id === id) {
        item.checked = !item.checked;
      }
      return item;
    }));
  };

  const handleAllExcelDown = () => {
    ScientistService.getScientistsAllExcelDown();
  };

  const handleSearchExcelDown = () => {
    const parsedParams = Object.keys(searchParams).reduce((acc, key) => {
      if (key in query) {
        let value = query[key];
        if (key === 'page' || key === 'size') {
          acc[key] = Array.isArray(value) ? Number(value[0]) : Number(value) || 0;
        } else {
          acc[key] = Array.isArray(value) ? value[0] : value || '';
        }
      }
      return acc;
    }, {} as ScientistSearchReq);
    ScientistService.getScientistsSearchExcelDown(parsedParams);
  };
  
  const handleDetailFormOpen = (//e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
      detail: ScientistSearchRes) => {
    // const x = e.clientX;
    // const y = e.clientY;
    const left = (detailFormPopups.length+1)*20;
    const top = (detailFormPopups.length+1)*20;
    
    if (detailFormPopups.filter((popup) => popup.id === detail.id).length === 0) {
      setDetailFormPopups((prev) => [
        ...prev,
        { id: detail.id, top: top, left: left }
      ]);
    }
  };
  const handleDetailFormClose = (id: number) => {
    setDetailFormPopups((prev) => prev.filter((popup) => popup.id !== id));
  };

  const handleDetailCardOpen = (//e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
      detail: ScientistSearchRes) => {
    // const x = e.clientX;
    // const y = e.clientY;
    const left = (detailCardPopups.length+1)*20;
    const top = (detailCardPopups.length+1)*20;
  
    if (detailCardPopups.filter((popup) => popup.id === detail.id).length === 0) {
      setDetailCardPopups((prev) => [
        ...prev,
        { id: detail.id, top: top, left: left }
      ]);
    }
  };
  const handleDetailCardClose = (id: number) => {
    setDetailCardPopups((prev) => prev.filter((popup) => popup.id !== id));
  };
  

  const handleRouteAndSearch = (param?: {name: string, value: any}[]) => {
    let queryParam = Object.keys(searchParams).reduce((obj, key) => {
      if (searchParams[key] !== '' && searchParams[key] !== null) {
        obj[key] = searchParams[key];
      }
      return obj;
    }, {});
    
    param?.forEach(item => {
      if (item.name === 'page' || item.name === 'size') {
        queryParam = { ...queryParam, [item.name]: item.value };
      } else {
        return;
      }
    });

    router.push({
      pathname: `/prototype/mybatis/scientist/scientist-mng`,
      query: queryString.stringify(queryParam),
    });
  };

  useEffect(() => {
    init();

    const parsedParams = Object.keys(searchParams).reduce((acc, key) => {
      if (key in query) {
        let value = query[key];
        if (key === 'page' || key === 'size') {
          acc[key] = Array.isArray(value) ? Number(value[0]) : Number(value) || 0;
        } else {
          acc[key] = Array.isArray(value) ? value[0] : value || '';
        }
      }
      return acc;
    }, {} as ScientistSearchReq);

    let params = null;
    if (Object.keys(parsedParams).length > 0) {
      params = {...searchParams, ...parsedParams};
    } else {
      params = searchScientistReqDef;
    }
    setSearchParams(params);
    
    ScientistService.getScientistsSearch(params)
      .then((response) => {
        setPageInfoRes(response.data.pageInfo);
        setScientistDataList(response.data.pageData.map((row: ScientistSearchRes) => ({...row, checked: false})));
      });
  }, [query]);

  return (
    <div>
      <SearchArea>
        <SearchGroup>
          <SearchRow>
            <label>
              name
              <input type="text" placeholder="name"
                value={searchParams?.name ?? ''}
                onChange={(e) => setSearchParams({
                  ...searchParams,
                  name: e.target.value,
                })}
                onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              />
            </label>
            
            <label>
              field of study
              <FormSelect items={codeFOS}
                value={searchParams?.fosCd ?? ''}
                onChange={(e) => setSearchParams({
                  ...searchParams,
                  fosCd: e.target.value,
                })}
                textAlign="left"
                width="120px"
              />
            </label>
            
            <label>
              century
              <FormSelect items={codeCentury}
                value={searchParams?.century ?? ''}
                size={`sm`}
                onChange={(e) => setSearchParams({
                  ...searchParams,
                  century: e.target.value,
                })}
                textAlign="center"
              />
            </label>
          </SearchRow>

          <ButtonGroup 
            leftButtons={[
              {label: "search", onClick: () => handleRouteAndSearch()},
            ]}
            rightButtons={[
              {label: "excel (all)", onClick: () => handleAllExcelDown()},
              {label: "excel", onClick: () => handleSearchExcelDown()},
            ]}
          />
        </SearchGroup>
      </SearchArea>

      <CheckedArea>
        <div>
          <button onClick={() => handleCompare()}>compare</button>
        </div>
        {scientistDataList.filter((item) => item.checked)?.map((item, index) => (
          <span key={`check-span-${index}`}>{item.name}</span>
        ))}
      </CheckedArea>

      <Table>
        <colgroup>
          <col width="50px" />
          <col width="80px" />
          <col width={180} />
          <col width={120} />
          <col width={120} />
          <col width={120} />
          <col />
        </colgroup>
        <thead>
          <ThRow>
            <Th></Th>
            <Th>no.</Th>
            <Th>name</Th>
            <Th>year of birth</Th>
            <Th>year of death</Th>
            <Th>field of study</Th>
            <Th></Th>
          </ThRow>
        </thead>
        <tbody>
          {scientistDataList?.length > 0 ? (
            scientistDataList.map((item, index) => {
              return (
                <Tr key={index} onDoubleClick={() => handleDetailCardOpen(item)} 
                  className={`${
                    (detailFormPopups.filter((popup) => popup.id === item.id).length > 0) ||
                    (detailCardPopups.filter((popup) => popup.id === item.id).length > 0)
                    ? 'selected'
                    : ''}`}>
                  <Td textAlign="center"
                    onClick={() => toggleRowChecked(item.id)}
                    onDoubleClick={(e) => (e.stopPropagation())}>
                    <input type="checkbox" 
                      checked={item.checked}
                      onDoubleClick={(e) => (e.stopPropagation())}
                      />
                  </Td>
                  <Td textAlign="right">
                    {item.id}
                  </Td>
                  <Td>
                    {/* <span onClick={() => router.push({
                          pathname: `${item.id}`,
                          query: queryString.stringify(searchParams),
                        })}>
                    </span> */}
                    {item.name}
                  </Td>
                  <Td textAlign="center">
                    {item.birthYear}
                  </Td>
                  <Td textAlign="center">
                    {item.deathYear}
                  </Td>
                  <Td textAlign="center">
                    {item.fosNm}
                  </Td>
                  <Td textAlign="center">
                    
                  </Td>
                </Tr>
              );
            })
          ) : (
            <Tr>
              <Td colSpan={6} className={'empty'}>
                no data
              </Td>
            </Tr>
          )}
        </tbody>
      </Table>
      <Page total={pageInfoRes?.total ?? 0}
        page={searchParams.page ??  0}
        size={searchParams.size ?? PageSizeOptions[0]}
        onClick={(page: number, size: number) =>
          handleRouteAndSearch([
            { name: "page", value: page },
            { name: "size", value: size },
          ])
        }
      />
      
      {detailFormPopups.map((popup) => (
        <DetailPopup 
          key={popup.id}
          handleClose={() => handleDetailFormClose(popup.id)}
          layoutType="form"
          top={popup.top}
          left={popup.left}
        >
          <ScientistDetailForm id={popup.id} />
        </DetailPopup>
      ))}
      
      {detailCardPopups.map((popup) => (
        <DetailPopup 
          key={popup.id}
          handleClose={() => handleDetailCardClose(popup.id)} 
          layoutType="card"
          top={popup.top}
          left={popup.left}
        >
          <ScientistDetailCard id={popup.id} />
        </DetailPopup>
      ))}
    </div>
  )
};

export default ScientistMng;

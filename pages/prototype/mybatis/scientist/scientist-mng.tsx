import { useRouter } from "next/router";
import queryString from 'query-string';
import { useEffect, useState } from "react";

// import ButtonGroup from "@/styles/ButtonGroupStyled";
import FormSelect, { SelectItem } from "@/styles/FormSelectStyled";
import { ButtonGroup, SearchArea, SearchGroup, SearchRow } from "@/styles/SearchArea";
import { Table, Td, TdRow, Th, ThRow } from "@/styles/TableStyled";
import Page from "@/styles/PageStyled";

import { PageInfoRes, PageSizeOptions } from "@/types/main/CommonTypes";
import { ScientistSearchReq, ScientistSearchRes } from "@/types/mybatis/ScientistTypes";

import CodeService from "@/services/main/CodeService";
import ScientistService from "@/services/mybatis/ScientistService";

const Contents = () => {
  const router = useRouter();
  const { query } = router;
  const [ FOS, setFOS ] = useState<SelectItem[]>();
  const [ century, setCentury ] = useState<SelectItem[]>();
  const searchScientistReqDef: ScientistSearchReq = {
    name: '',
    fosCd: '',
    century: undefined,
    page: 0,
    size: PageSizeOptions[0],
  };
  const [ searchParams, setSearchParams ] = useState<ScientistSearchReq>(searchScientistReqDef);
  const [ pageInfoRes, setPageInfoRes ] = useState<PageInfoRes>();
  const [ scientistSearchResList, setScientistSearchResList ] = useState<ScientistSearchRes[]>([]);
  const init = async () => {
    setFOS(CodeService.getFormSelectItem('scientist:fos'));
    let codes: SelectItem[] = [{
      label: '전체',
      value: '',
    }];
    for (let i=20; i>14; i--) {
      codes.push({
        label: `${i}세기`,
        value: (i) + '',
      });
    }
    setCentury(codes);
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

  const handleRouteAndSearch = (name: string = null, _value: any = null) => {
    let queryParam = Object.keys(searchParams).reduce((obj, key) => {
      if (searchParams[key] !== '' && searchParams[key] !== null) {
        obj[key] = searchParams[key];
      }
      return obj;
    }, {});
    
    if (name === 'page' || name === 'size') {
      queryParam = { ...queryParam, [name]: _value };
    } else if (name ===  null) {
      queryParam = { ...queryParam, page: 0, size: PageSizeOptions[0]};
    } else {
      return;
    }
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
        setScientistSearchResList(response.data.pageData);
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
              <FormSelect items={FOS}
                value={searchParams?.fosCd ?? ''}
                size={`sm`} 
                onChange={(e) => setSearchParams({
                  ...searchParams,
                  fosCd: e.target.value,
                })}
              />
            </label>
            
            <label>
              century
              <FormSelect items={century}
                value={searchParams?.century ?? ''}
                size={`sm`}
                onChange={(e) => setSearchParams({
                  ...searchParams,
                  century: e.target.value,
                })}
              />
            </label>
          </SearchRow>

          <ButtonGroup buttons={[
            {label: "EXCEL", onClick: () => handleSearchExcelDown()},
            {label: "EXCEL(ALL)", onClick: () => handleAllExcelDown()},
            {label: "Search", onClick: () => handleRouteAndSearch()}
          ]} />
        </SearchGroup>
      </SearchArea>

      <Table>
        <colgroup>
          <col width={80} />
          <col width={150}/>
          <col width={120} />
          <col width={120} />
          <col width={120} />
          <col width={80} />
          <col width={120} />
        </colgroup>
        <thead>
          <ThRow>
            <Th>no.</Th>
            <Th>name</Th>
            <Th>year of birth</Th>
            <Th>year of death</Th>
            <Th>field of study</Th>
            <Th>modify</Th>
            <Th>modify</Th>
          </ThRow>
        </thead>
        <tbody>
          {scientistSearchResList?.length > 0 ? (
            scientistSearchResList.map((item, index) => {
              return (
                <TdRow key={index}>
                  <Td textAlign="right">
                    {item.id}
                  </Td>
                  <Td>
                    <span onClick={() => 
                      router.push({
                        pathname: `${item.id}`,
                        query: queryString.stringify(searchParams),
                      })}>{item.name}</span>
                  </Td>
                  <Td textAlign="center">
                    {item.birthYear}
                  </Td>
                  <Td textAlign="center">
                    {item.deathYear}
                  </Td>
                  <Td>
                    {item.fosNm}
                  </Td>
                  <Td textAlign="center">
                    {item.modifyName}
                  </Td>
                  <Td textAlign="center">
                    {item.modifyTime}
                  </Td>
                </TdRow>
              );
            })
          ) : (
            <TdRow>
              <Td colSpan={7} className={'empty'}>
                no data
              </Td>
            </TdRow>
          )}
        </tbody>
      </Table>
      <Page
        total={pageInfoRes?.total ?? 0}
        page={searchParams.page ??  0}
        size={searchParams?.size ?? PageSizeOptions[0]}
        onClick={(value: number) => handleRouteAndSearch('page', value)}
      />
    </div>
  )
};

export default Contents;

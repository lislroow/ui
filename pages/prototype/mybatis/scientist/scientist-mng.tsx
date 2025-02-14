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
import PageOption from "@/styles/PageOptionStyled";
import ScientistDetail from "@/components/prototype/mybatis/scientist/scientist-detail";
import Detail from "@/components/main/Detail";

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
  const [ scientistSearchResList, setScientistSearchResList ] = useState<ScientistSearchRes[]>([]);

  const [ isDetailOpen, setDetailOpen ] = useState(false);
  const [ detailId, setDetailId ] = useState<number>();

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

  const handleDetail = (detailId: number) => {
    setDetailId(detailId);
    setDetailOpen(true);
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
                <TdRow key={index} onDoubleClick={() => handleDetail(item.id)}>
                  <Td textAlign="right">
                    {item.id}
                  </Td>
                  <Td>
                    <span onClick={() => 
                      // router.push({
                      //   pathname: `${item.id}`,
                      //   query: queryString.stringify(searchParams),
                      // })
                      handleDetail(item.id)
                      }>
                      {item.name}
                    </span>
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
      
      <Detail isDetailOpen={isDetailOpen} setDetailOpen={setDetailOpen} width="350px">
        <ScientistDetail id={detailId} />
      </Detail>
      
    </div>
  )
};

export default ScientistMng;

import { useRouter } from "next/router";
import queryString from 'query-string';
import { useEffect, useState } from "react";

import FormSelect, { SelectItem } from "@/styles/FormSelectStyled";
import { ButtonGroup, SearchArea, SearchGroup, SearchRow } from "@/styles/SearchArea";
import { Table, Td, Tr, Th, ThRow } from "@/styles/TableStyled";
import Page from "@/styles/PageStyled";

import { PageInfoRes, PageSizeOptions } from "@/types/main/CommonTypes";
import { ScientistSearchReq, ScientistSearchRes } from "@/types/mybatis/ScientistTypes";

import CodeService from "@/services/main/CodeService";
import ScientistService from "@/services/mybatis/ScientistService";
import ScientistDetailForm from "@/components/prototype/mybatis/scientist/detail-form";
import DetailPopup from "@/popup/DetailPopup";
import ScientistDetailCard from "@/components/prototype/mybatis/scientist/detail-card";

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

  const [ isDetailFormOpen, setDetailFormOpen ] = useState(false);
  const [ detailFormId, setDetailFormId ] = useState<number>();
  const [ detailFormTitle, setDetailFormTitle ] = useState<string>();

  const [ isDetailCardOpen, setDetailCardOpen ] = useState(false);
  const [ detailCardId, setDetailCardId ] = useState<number>();
  const [ detailCardTitle, setDetailCardTitle ] = useState<string>();

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

  const handleDetailFormOpen = (detail: ScientistSearchRes) => {
    setDetailFormId(detail.id);
    setDetailFormTitle(`[${detail.id}] ${detail.name}`);
    setDetailFormOpen(true);
  };

  const handleDetailFormClose = () => {
    setDetailFormId(undefined);
    setDetailFormTitle(undefined);
    setDetailFormOpen(false);
  };

  const handleDetailCard = (detail: ScientistSearchRes) => {
    setDetailCardId(detail.id);
    setDetailCardTitle(`[${detail.id}] ${detail.name}`);
    setDetailCardOpen(true);
  };

  const handleDetailCardClose = () => {
    setDetailCardId(undefined);
    setDetailCardTitle(undefined);
    setDetailCardOpen(false);
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
          <col width="80px" />
          <col width={180} />
          <col width={120} />
          <col width={120} />
          <col width={120} />
          <col />
        </colgroup>
        <thead>
          <ThRow>
            <Th>no.</Th>
            <Th>name</Th>
            <Th>year of birth</Th>
            <Th>year of death</Th>
            <Th>field of study</Th>
            <Th></Th>
          </ThRow>
        </thead>
        <tbody>
          {scientistSearchResList?.length > 0 ? (
            scientistSearchResList.map((item, index) => {
              return (
                <Tr key={index} onDoubleClick={() => handleDetailFormOpen(item)} 
                  className={`${(isDetailFormOpen || isDetailCardOpen) && (item.id === detailFormId || item.id === detailCardId) ? 'selected' : ''}`}>
                  <Td textAlign="right">
                    {item.id}
                  </Td>
                  <Td>
                    <span onClick={() => 
                      // router.push({
                      //   pathname: `${item.id}`,
                      //   query: queryString.stringify(searchParams),
                      // })
                      handleDetailCard(item)
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
      
      <DetailPopup isDetailOpen={isDetailFormOpen} handleClose={handleDetailFormClose} width="350px" title={detailFormTitle}>
        <ScientistDetailForm id={detailFormId} />
      </DetailPopup>
      
      <DetailPopup isDetailOpen={isDetailCardOpen} handleClose={handleDetailCardClose} layoutType="card">
        <ScientistDetailCard id={detailCardId} />
      </DetailPopup>
    </div>
  )
};

export default ScientistMng;

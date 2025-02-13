import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import queryString from "query-string";

import storeAlert, { showAlert } from "@/redux/store-alert";
import StylModal from "@/styles/ModalStyled";
import StylFormSelect, { SelectItem } from "@/styles/FormSelectStyled";
import ButtonGroup from "@/styles/ButtonGroupStyled";
import FormField, { FormFieldWrap } from "@/styles/FormFieldStyled";

import {
  ScientistSearchRes,
  ScientistModifyReq,
} from '@/types/mybatis/ScientistTypes';
import CodeService from "@/services/main/CodeService";
import MybatisSampleService from '@/services/mybatis/ScientistService';

const Page = () => {
  const router = useRouter();
  const { query } = router;
  
  const [ FOS, setFOS ] = useState<SelectItem[]>();

  const [ scientistSearchRes, setScientistSearchRes ] = useState<ScientistSearchRes>();
  const [ scientistModifyReq, setScientistModifyReq ] = useState<ScientistModifyReq>({
    id: null,
    name: null,
    birthYear: null,
    deathYear: null,
    fosCd: null,
  });
  const [ invalid, setInvalid ] = useState(false);
  const [ saveModalOpen, setSaveModalOpen ] = useState(false);
  const [ deleteModalOpen, setDeleteModalOpen ] = useState(false);
  const [ deleteModalConfirm, setDeleteModalConfirm ] = useState<number>();
  
  const init = async () => {
    setFOS(CodeService.getFormSelectItem('scientist:fos'));
  }

  const handleParams = (name: string, _value: any) => {
    setScientistSearchRes({ ...scientistSearchRes, [name]: _value });
  };
  
  const handleList = () => {
    router.push({
      pathname: '/prototype/mybatis/scientist/scientist-mng',
      query: queryString.stringify(router.query),
    });
  };
  
  const handleSave = () => {
    MybatisSampleService.putScientist(scientistModifyReq)
      .then((response) => {
        router.push({
          pathname: `${router.query.id}`,
          query: queryString.stringify(router.query),
        });
      });
  };
  
  const handleDelete = () => {
    MybatisSampleService.deleteScientist(scientistSearchRes.id)
      .then((response) => {
        handleList();
      });
  };
  
  useEffect(() => {
    init();

    if (!router.isReady) return;
    const id = router.query.id;
    if (!id) {
      router.replace('/prototype/mybatis/scientist/scientist-mng');
      return;
    }
    MybatisSampleService.getScientist(id)
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
  }, [router.isReady]);

  useEffect(() => {
    if (scientistSearchRes) {
      // scientistRes > modifyScientistReq
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
    <div className="contents">
      <ButtonGroup buttons={[
        {label: "목록", onClick: () => handleList()},
        {label: "저장", onClick: () => setSaveModalOpen(true)},
        {label: "삭제", onClick: () => setDeleteModalOpen(true)},
      ]} />
      <FormFieldWrap>
        <FormField title="id">
          <span>{scientistSearchRes?.id}</span>
        </FormField>
        <FormField title="name" required>
          <input type="text"
            className={`sm`}
            placeholder="input name"
            value={scientistSearchRes?.name ?? ''}
            tabIndex={1001}
            onChange={(e) => handleParams('name', e.target.value)} />
          {invalid && !scientistSearchRes?.name && (
            <span style={{ color: '#FF8080', fontSize: '15px' }}>not allow empty string</span>)}
        </FormField>
        <FormField title="year of birth" required>
          <input type="text"
            className={`sm`}
            value={scientistModifyReq?.birthYear ?? ''}
            tabIndex={1002}
            onChange={(e) => handleParams('birthYear', e.target.value)} />
          {invalid && !scientistModifyReq?.birthYear && (
            <span style={{ color: '#FF8080', fontSize: '15px' }}>not allow empty string</span>)}
        </FormField>
        <FormField title="year of death">
          <input type="text"
            className={`sm`}
            value={scientistModifyReq?.deathYear ?? ''}
            tabIndex={1003}
            onChange={(e) => handleParams('deathYear', e.target.value)} />
        </FormField>
        <FormField title="field of study">
          <StylFormSelect items={FOS}
            value={scientistModifyReq?.fosCd ?? ''}
            size={`sm`}
            tabIndex={1004}
            onChange={(e) => handleParams('fosCd', e.target.value)} />
        </FormField>
        <FormField title="modify id">
          <span>{scientistSearchRes?.modifyId}</span>
        </FormField>
        <FormField title="modify name">
          <span>{scientistSearchRes?.modifyName}</span>
        </FormField>
        <FormField title="modify time">
          <span>{scientistSearchRes?.modifyTime}</span>
        </FormField>
        <FormField title="create id">
          <span>{scientistSearchRes?.createId}</span>
        </FormField>
        <FormField title="create name">
          <span>{scientistSearchRes?.createName}</span>
        </FormField>
        <FormField title="create time">
          <span>{scientistSearchRes?.createTime}</span>
        </FormField>
      </FormFieldWrap>
      <StylModal open={saveModalOpen}
        handleOkClick={() => {
          setSaveModalOpen(false);
          handleSave();
        }}
        handleCloseClick={() => setSaveModalOpen(false)}>
        <span>저장하시겠습니까?</span>
      </StylModal>
      <StylModal open={deleteModalOpen}
        handleOkClick={() => {
          if (deleteModalConfirm !== scientistSearchRes.id) {
            return false;
          }
          setDeleteModalOpen(false);
          handleDelete();
        }}
        handleCloseClick={() => setDeleteModalOpen(false)}>
        <main>
          <span>{'삭제 대상 id \'' + scientistSearchRes?.id + '\' 를 입력해주세요.'}</span>
          <div style={{ display: 'flex' }}>
            <div>
              <input type="text"
                className={`el_input_lg`}
                style={{ height: '40px', textAlign: 'center' }}
                placeholder={scientistSearchRes?.id + ''}
                onChange={(e) => setDeleteModalConfirm(Number(e.target.value))} />
            </div>
          </div>
        </main>
      </StylModal>
    </div>
  );
}

export default Page;

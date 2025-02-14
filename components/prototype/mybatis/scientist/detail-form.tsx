import { useState, useEffect } from "react";
import { useRouter } from "next/router";

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

interface ScientistDetailFormProps {
  id: number;
}

const ScientistDetailForm: React.FC<ScientistDetailFormProps> = ({id}) => {
  const router = useRouter();
  
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

  const handleParams = (name: string, value: any) => {
    setScientistSearchRes({ ...scientistSearchRes, [name]: value });
  };
  
  const handleSave = () => {
    MybatisSampleService.putScientist(scientistModifyReq)
      .then((response) => {
        router.reload();
      });
  };
  
  const handleDelete = () => {
    MybatisSampleService.deleteScientist(scientistSearchRes.id)
      .then((response) => {
        router.reload();
      });
  };
  
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
    <div>
      <ButtonGroup 
        rightButtons={[
          {label: "save", onClick: () => setSaveModalOpen(true)},
          {label: "delete", onClick: () => setDeleteModalOpen(true)},
        ]}
      />
      <FormFieldWrap>
        <FormField title="id">
          <span>{scientistSearchRes?.id}</span>
        </FormField>
        <FormField title="name" required>
          <input type="text"
            className={`me`}
            placeholder="input name"
            value={scientistSearchRes?.name ?? ''}
            tabIndex={1001}
            onChange={(e) => handleParams('name', e.target.value)} />
          {invalid && !scientistSearchRes?.name && (
            <span style={{ color: '#FF8080', fontSize: '15px' }}>not allow empty string</span>)}
        </FormField>
        <FormField title="year of birth" required>
          <input type="text"
            className={`me`}
            value={scientistModifyReq?.birthYear ?? ''}
            tabIndex={1002}
            onChange={(e) => handleParams('birthYear', e.target.value)} />
          {invalid && !scientistModifyReq?.birthYear && (
            <span style={{ color: '#FF8080', fontSize: '15px' }}>not allow empty string</span>)}
        </FormField>
        <FormField title="year of death">
          <input type="text"
            className={`me`}
            value={scientistModifyReq?.deathYear ?? ''}
            tabIndex={1003}
            onChange={(e) => handleParams('deathYear', e.target.value)} />
        </FormField>
        <FormField title="field of study">
          <StylFormSelect items={FOS}
            value={scientistModifyReq?.fosCd ?? ''}
            width="140px"
            tabIndex={1004}
            onChange={(e) => handleParams('fosCd', e.target.value === '' ? null : e.target.value)} />
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

export default ScientistDetailForm;

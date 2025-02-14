import { http } from '@/utils/http';
import storage from '@/utils/storage';
import { SelectItem } from '@/styles/FormSelectStyled';
import { AllCodeRes } from '@/types/main/CodeTypes';

const initAllCodes = () : void => {
  !storage.hasCodes() && (
    http.get('/story-api/v1/common/code-enum/all')
        .then((response) => {
          storage.setCodes(response.data);
      })
    );
}

const getYN = (labelY?: string, labelN?: string) => {
  const codes = [
    {
      label: '선택',
      value: '',
    },
    {
      label: labelY || 'Y',
      value: 'Y',
    },
    {
      label: labelN || 'N',
      value: 'N',
    },
  ]
  return codes;
}

const getCodes = (cdGrp: string) => {
  const allCodes : AllCodeRes[] = storage.getCodes();
  const codes = allCodes.find(item => item.cdGrp === cdGrp);
  // console.log(JSON.stringify(codes));
  return codes?.list;
}

const getCodeByCdGrp = (cdGrp: string) => {
  return http.get(`/story-api/v1/common-code/code-enum/${cdGrp}`);
};

const getFormSelectItem = (cdGrp: string, defaultOption?: string) : SelectItem[]  => {
  const codes = getCodes(cdGrp);
  if (!codes) {
    const result: SelectItem[] =  [
      {
        label: defaultOption || '- choose -',
        value: '',
      }
    ];
    return result;
  }
  const result: SelectItem[] =  codes.map(item => ({
    label: item.cdNm,
    value: item.cd,
  }));
  result.unshift({
    label: defaultOption || '- choose -',
    value: '',
  });
  return result;
};

const CodeService = {
  initAllCodes,
  getYN,
  getCodes,
  getCodeByCdGrp,
  getFormSelectItem,
};

export default CodeService;

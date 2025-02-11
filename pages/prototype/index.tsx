import { useDispatch } from 'react-redux';
import { showAlert } from "@/redux/store-alert";

const Page = () => {
  const dispatch = useDispatch();

  const handleShowAlert = () => {
    dispatch(
      showAlert({
        title: '경고!',
        message: '이것은 Redux Alert 메시지입니다.',
        details: '추가적인 상세 정보를 확인하세요.',
      })
    );
  };

  return (
    <>
      <div style={{textAlign: "center"}}>
        <button onClick={handleShowAlert}>Show Alert</button>
      </div>
    </>
  );
};

export default Page;

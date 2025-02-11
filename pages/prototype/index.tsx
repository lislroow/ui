import storeAlert, { actAlertShow } from "@/redux/store-alert";

const Page = () => {
  const showMessage = () => {
    storeAlert.dispatch(actAlertShow("503", "service unavailable", undefined));
  };

  return (
    <>
      <div style={{textAlign: "center"}}>
        <button onClick={() => showMessage()}>메시지</button>
      </div>
    </>
  )
};

export default Page;

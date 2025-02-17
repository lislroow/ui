import styled from "styled-components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import storeAlert from "@/redux/deprecated-store-alert";
import { RootState } from '@/redux/store-alert';

interface MessageProps {
  popupType: string;
};

const Message: React.FC<MessageProps> = ({popupType}) => {
  useEffect(() => {
    const style = document.documentElement.style;
    style.setProperty('--expand-icon', `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><text x="5" y="34" font-size="20" fill="%231E88E5">➖</text></svg>')`);
    style.setProperty('--collapse-icon', `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><text x="5" y="34" font-size="20" fill="%231E88E5">➕</text></svg>')`);
    style.setProperty('--btn-close-icon', `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path></svg>')`)
  }, []);

  const alert = useSelector((state: RootState) => state.alert);
  useEffect(() => {
    if (alert.display) {
      setPopupOpen(true);
    }
  }, [alert]);

  const [ isPopupOpen, setPopupOpen ] = useState(false);
  const [ isDetailShow, setDetailShow ] = useState(false);

  const handleClose = () => {
    setPopupOpen(false);
    setDetailShow(false);
  };

  const toggleDetailShow = () => {
    setDetailShow(!isDetailShow);
    // useDisableScroll(!isDetailShow);
  };

  return (
    <>
      {isPopupOpen && (
        <>
          <MessageStyled $isDetailShow={isDetailShow}>
            <div className="popup-top">
              <div className="popup-title">
                <span>{alert.title}</span>
              </div>
              <div className="btn_close">
                <button onClick={() => handleClose()} />
              </div>
            </div>
            <div className="popup-body">
              <div className="popup-body-message">
                {alert.message}
                {alert.details && (<button className="btn-detail" onClick={() => toggleDetailShow()}>...</button>)}
              </div>
              <div className="popup-body-detail">{alert.details}</div>
            </div>
          </MessageStyled>

          <OverlayStyled />
        </>
      )}
    </>
  );
};

const MessageStyled = styled.div<{ $isDetailShow: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  padding: 20px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
  z-index: 1000;

  .popup-top {
    display: grid;
    grid-template-columns: auto 35px;
    align-items: center;
    justify-content: space-between;
    background-color: white;
  };
  .popup-top > .popup-title {
    display: flex;
    justify-content: center;
    align-items: center;
  };
  .popup-top > .btn_close {
    // display: flex;
    // justify-content: center;
    // align-items: center;
    &> button {
      width: 35px;
      height: 35px;
      border: 0px solid lightgray;
      border-radius: 5px;
      cursor: pointer;
      display: grid;
      align-items: center;
      justify-content: center;
      background: var(--btn-close-icon) no-repeat center / 16px 16px;
    };
    &> button:hover {
      background-color: rgb(246, 248, 250);
    };
  };
  .popup-body {
  };
  .popup-body > .popup-body-message {
    font-size: 12px;
    text-align: left;
    &> .btn-detail {
      border: 1px solid lightgray;
      background-color: white;
      cursor: pointer;
    };
  };
  .popup-body > .popup-body-detail {
    display: ${({ $isDetailShow }) => ($isDetailShow ? 'block' : 'none')};
    font-size: 10px;
    text-align: left;
    word-wrap: break-word;
  };
`;

const OverlayStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

export default Message;
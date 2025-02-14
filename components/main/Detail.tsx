import { useEffect, useState } from "react";
import styled from "styled-components";

interface DetailProps {
  children: React.ReactNode;
  isDetailOpen: boolean;
  setDetailOpen: (isTrue: boolean) => void;
  width?: string;
  title?: string;
}

const Detail: React.FC<DetailProps> = ({children, isDetailOpen, setDetailOpen, width, title}) => {
  useEffect(() => {
    const style = document.documentElement.style;
    style.setProperty('--btn-close-icon', `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path></svg>')`)
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    if (isDetailOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDetailOpen]);
  
  const handleClose = () => {
    setDetailOpen(false);
  };
  
  return (
    <>
      {isDetailOpen && (
        <DetailStyled width={width}>
          <div className="popup-top">
            {title && (
              <div className="popup-title">
                <span>{title}</span>
              </div>
            )}
            <div className="btn_close">
              <button onClick={() => handleClose()} />
            </div>
          </div>
          <div>
            {children}
          </div>
        </DetailStyled>
      )}
    </>
  );
};

const DetailStyled = styled.div<{ width: string }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${({width}) => width};
  padding: 20px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.9);
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
`;

export default Detail;

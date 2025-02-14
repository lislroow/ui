import { useEffect, useRef, useState } from "react";
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
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [ position, setPosition ] = useState({ x: 100, y: 100 });
  const [ isDragging, setIsDragging ] = useState(false);
  const [ offset, setOffset ] = useState({ x: 0, y: 0 });
  
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

  // Drag and Drop
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!popupRef.current) return;

    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !popupRef.current) return;

    const popupWidth = popupRef.current.offsetWidth;
    const popupHeight = popupRef.current.offsetHeight;
    const screenWidth = window.innerWidth-1;
    const screenHeight = window.innerHeight;

    let newX = e.clientX - offset.x;
    let newY = e.clientY - offset.y;

    if (newX < 0) newX = 0;
    if (newX + popupWidth > screenWidth) newX = screenWidth - popupWidth;
    if (newY < 0) newY = 0;
    if (newY + popupHeight > screenHeight) newY = screenHeight - popupHeight;

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);


  
  return (
    <DetailPopupStyled isDetailOpen={isDetailOpen} className="detailPopup"
      ref={popupRef}
      style={{ left: position.x, top: position.y }}
    >
      {isDetailOpen && (
        <DetailStyled width={width}>
          <div className="popup-header" onMouseDown={handleMouseDown}>
            {title && (
              <div className="popup-title">
                <span>{title}</span>
              </div>
            )}
            <div className="btn_close">
              <button onClick={() => handleClose()} />
            </div>
          </div>
          <div className="popup-body">
            {children}
          </div>
        </DetailStyled>
      )}
    </DetailPopupStyled>
  );
};

const DetailPopupStyled = styled.div<{ isDetailOpen: boolean }>`
  position: absolute;
  // width: 300px;
  // height: 200px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  // user-select: none;
  display: ${({isDetailOpen}) => isDetailOpen ? 'block' : 'none' };
`;

const DetailStyled = styled.div<{ width: string }>`
  // position: fixed;
  // top: 50%;
  // left: 50%;
  // transform: translate(-50%, -50%);
  position: relative;
  width: ${({width}) => width};
  padding: 0;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.9);
  border-radius: 8px;
  text-align: center;
  z-index: 1000;

  .popup-header {
    display: grid;
    grid-template-columns: auto 35px;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    padding: 10px;
  };
  .popup-header > .popup-title {
    display: flex;
    justify-content: center;
    align-items: center;
  };
  .popup-header > .btn_close {
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
    padding: 10px;
  };
`;

export default Detail;

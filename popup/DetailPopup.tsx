import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface DetailPopupProps {
  children: React.ReactNode;
  isDetailOpen: boolean;
  handleClose: () => void;
  layoutType?: 'form' | 'card';
  width?: string;
  title?: string;
}

const DetailPopup: React.FC<DetailPopupProps> = ({
  children,
  isDetailOpen,
  handleClose,
  layoutType = 'form',
  width,
  title
}: DetailPopupProps) => {
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
      const isFocusedInsidePopup = popupRef.current.contains(document.activeElement);
      console.log(document.activeElement);
      if (event.key === "Escape" && isFocusedInsidePopup) {
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
  

  // Drag and Drop
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!popupRef.current) return;

    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const throttle = (func: (...args: any[]) => void, delay: number) => {
    let lastCall = 0;
    return (...args: any[]) => {
      const now = new Date().getTime();
      if (now - lastCall < delay) return;
      lastCall = now;
      func(...args);
    };
  };

  const handleMouseMove = throttle((e: MouseEvent) => {
    console.log('handleMouseMove');
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
  }, 10);

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
    <DetailPopupWrapStyled $isDetailOpen={isDetailOpen} className="detailPopup"
      ref={popupRef}
      onMouseDown={handleMouseDown}
      onClick={() => popupRef.current?.focus()}
      tabIndex={-1}
      style={{ left: position.x, top: position.y }}
    >
      {isDetailOpen && (
        <DetailPopupStyled width={width}>
          <div className={`popup-header`}>
            <div className="popup-title">
              <span>{title}</span>
            </div>
            <div className="btn_close">
              <button onClick={() => handleClose()} />
            </div>
          </div>
          <div className={`popup-body --layout-type-${layoutType}`}>
            {children}
          </div>
        </DetailPopupStyled>
      )}
    </DetailPopupWrapStyled>
  );
};

const DetailPopupWrapStyled = styled.div<{ $isDetailOpen: boolean }>`
  position: absolute;
  padding: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  user-select: none;
  display: ${({$isDetailOpen}) => $isDetailOpen ? 'inline-block' : 'none' };

  &:focus-within {
    border: 2px solid rgb(124, 255, 146);
  };
`;

const DetailPopupStyled = styled.div<{ width: string }>`
  position: relative;
  width: auto; /* 내부 콘텐츠 크기에 맞춤 */
  max-width: 100%; /* 필요 시 최대 너비 제한 */
  padding: 0;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.9);
  border-radius: 8px;
  display: flex;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden; // 초과 영역 숨김
  
  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // background-color: white;
    padding: 0;
    // position: relative;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%; /* DnD 는 absolute 가 아니면 mouse up 이벤트가 발생하지 않아 popup-header 를 100% 로 함 */
    z-index: 2;

    &> .popup-title {
      position: absolute;
      top: 20px;
      left: 20px;
    };
    &> .btn_close {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 10;
      pointer-events: auto;
      
      &> button {
        width: 35px;
        height: 35px;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--btn-close-icon) no-repeat center / 16px 16px;
      };
      &> button:hover {
        background-color: rgb(246, 248, 250);
      };
    };
  };
  .popup-body {
    display: flex;
    z-index: 1; /* body 내용을 선택할 수 있도록 함 */

    &.--layout-type-form {
      padding: 30px;
      z-index: 3;
    };
    &.--layout-type-card {
      position: relative;
      width: auto;
      border-radius: inherit;
    };
  };
`;

export default DetailPopup;

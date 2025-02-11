import styled from "styled-components";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { MenuType } from "@/types/MenuTypes";

interface TopbarProps {
  menuList: MenuType[];
  toggleSidebar: (isTrue: boolean) => void;
};

const Topbar: React.FC<TopbarProps> = ({menuList, toggleSidebar}) => {
  const router = useRouter();
  const [ currMenu, setCurrMenu ] = useState<MenuType>();
  const refTopbar = useRef<any>();
  const [ isTopbarFix, setTopbarFix ] = useState(false);
  
  useEffect(() => {
    const style = document.documentElement.style;
    style.setProperty("--sidebar-open-icon", 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\'%3E%3Cpath fill=\'%23000\' d=\'M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z\'%3E%3C/path%3E%3C/svg%3E")');
    
  }, []);

  useEffect(() => {
    setCurrMenu(menuList?.find(item => router?.pathname.startsWith(item.pathname)));
  }, [menuList]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      const status = (prev) => (prev !== !entry.isIntersecting ? !entry.isIntersecting : prev);
      setTopbarFix(status);
    }, { threshold: 0 });
    if (refTopbar.current) {
      observer.observe(refTopbar.current);
    }
    return () => {
      if (refTopbar.current) {
        observer.unobserve(refTopbar.current);
      }
    };
  }, []);

  return (
    <>
      <div ref={refTopbar} style={{ height: "0px", background: "transparent" }} />
      <TopbarStyled $isTopbarFix={isTopbarFix}>
        <div className="sidebar-open-button">
          <button onClick={() => toggleSidebar(true)}>
          </button>
        </div>
        <div className="topbar-menu">
          <ul>
            {menuList && menuList?.length > 0 && 
              menuList?.map((item) => {
                return (
                  <li className={item.mid === currMenu?.mid ? 'active' : ''} key={item.mid}>
                    <a href={item.pathname} className={item.mid === currMenu?.mid ? 'active' : ''}>
                      <span>{item.icon}</span>{item.title}</a>
                  </li>
                );
              })
            }
          </ul>
        </div>
      </TopbarStyled>
    </>
  );
};

const TopbarStyled = styled.div<{ $isTopbarFix: boolean }>`
  width: 100%;
  height: 50px;
  position: ${({ $isTopbarFix }) => ($isTopbarFix ? "fixed" : "relative")};
  top: 0;
  left: 0;
  background-color: ${({ $isTopbarFix }) => ($isTopbarFix ? "lightgray" : "white")};
  display: flex;
  border-bottom: 1px solid #f2f4f7;
  
  .topbar-menu {
    // border: 1px solid cyan;
    display: flex;
    flex: 1;
    flex-grow: 1;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
  };
  .topbar-menu ul {
    // border: 1px solid red;
    width: 100%;
    padding: 0;
    margin: 10px 0;
    display: flex;
    justify-content: space-around;
  };
  .topbar-menu ul > li {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    border-radius: 5px;
    // border: 1px solid green;
    &.active {
      background:rgb(243, 243, 243);
    };
  };
  .topbar-menu ul > li > a {
    padding: 10px;
  };
  .topbar-menu ul > li:hover {
    background:rgb(222, 222, 222);
  };
  .topbar-menu ul > li > a {
    text-decoration: none;
    color: ${({ $isTopbarFix }) => ($isTopbarFix ? "white" : "black")};
    &.active {
      color: black;
    };
  };
  .topbar-menu ul > li > a span {
    margin-right: 10px;
  };

  .sidebar-open-button {
    // position: fixed;
    // top: 0;
    // left: 0;
    // border: 1px solid blue;
    margin: 20px 20px;
    display: flex;
    column-gap: 10px;
    align-items: center;
  };
  .sidebar-open-button > button {
    width: 35px;
    height: 35px;
    background-color: rgb(246, 248, 250);
    border: 1px solid lightgray;
    display: grid;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 5px;
    background: var(--sidebar-open-icon) no-repeat center / 24px 24px;
    &:hover {
      background-color: rgb(239, 239, 239);
    };
  };
  
`;

export default Topbar;

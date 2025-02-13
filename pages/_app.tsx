import { AppProps } from 'next/app';
import { useRouter } from "next/router";
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Provider } from 'react-redux';
import storeAlert from '@/redux/store-alert';

import '@/css/globals.css';
import User from "@/components/main/User";
import SidebarMenu from "@/components/main/SidebarMenu";
import Message from "@/components/main/Message";
import storage from "@/utils/storage";
import { MenuType } from "@/types/main/MenuTypes";
import { UserType } from "@/types/main/UserTypes";
import UserService from "@/services/main/UserService";
import MenuService from "@/services/main/MenuService";
import CodeService from "@/services/main/CodeService";


const AppStructer = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [ user, setUser ] = useState<UserType>({});
  const [ isLogin, setLogin ] = useState<boolean>(false);
  const [ isSidebarOpen, setSidebarOpen ] = useState(false);
  const [ isSidebarPinned, setSidebarPinned ] = useState(false);
  const [ isTopbarFix, setTopbarFix ] = useState(false);
  const [ menuAll, setMenuAll ] = useState<MenuType[]>();
  const [ menuLv1, setMenuLv1 ] = useState<MenuType>();
  const [ currMenu, setCurrMenu ] = useState<MenuType>();
  const refTopbar = useRef<any>();

  
  const toggleSidebarOpen = (isTrue: boolean) => {
    if (isTrue) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    setSidebarOpen(isTrue);
  };
  const toggleSidebarPinned = () => {
    setSidebarPinned((prev) => !prev);
    if (isSidebarOpen === true && isSidebarPinned !== true) {
      toggleSidebarOpen(false);
    }
    storage.setPreference('sidebarPinned', !isSidebarPinned);
  };
  
  const init = () => {
    MenuService.initMenu();
    CodeService.initAllCodes();
    if (UserService.isLogin()) {
      const user = storage.getUser();
      if (user) {
        setUser(user);
        setLogin(true);
      } else {
        UserService.getInfo().then((response) => {
          storage.setUser(response.data);
          setUser(response.data);
          setLogin(true);
        });
      }
    }

    const _menuAll: MenuType[] = storage.getMenu();
    
    setMenuAll(_menuAll);
  };

  useEffect(() => {
    init();
  }, [router.query]);

  useEffect(() => {
    const style = document.documentElement.style;
    style.setProperty("--sidebar-open-icon", 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\'%3E%3Cpath fill=\'%23000\' d=\'M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z\'%3E%3C/path%3E%3C/svg%3E")');
    style.setProperty('--btn-pinned-icon', `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><text x="0" y="14" font-size="14" fill="%231E88E5">📍</text></svg>')`);
    style.setProperty('--btn-unpinned-icon', `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><text x="0" y="14" font-size="14" fill="%231E88E5">📌</text></svg>')`);
    setSidebarPinned(storage.getSidebarPinned());
  }, []);

  useEffect(() => {
    const _menuLv1 = menuAll?.find(lv1 => router?.pathname.startsWith(lv1.pathname));

    const menuLv1_submenus = _menuLv1?.submenus?.map(menuLv2 => {
      const menuLv2_isOpen = router?.pathname.startsWith(menuLv2.pathname);
      const menuLv2_isActive = router?.pathname.startsWith(menuLv2.pathname);
      const menuLv2_submenus = menuLv2.submenus?.map(menuLv3 => {
        const menuLv3_isActive = router?.pathname.startsWith(menuLv3.pathname?.substring(0, menuLv3.pathname?.lastIndexOf('/')));
        return { ...menuLv3, isActive: menuLv3_isActive };
      });
      return { ...menuLv2, isOpen: menuLv2_isOpen, isActive: menuLv2_isActive, submenus: menuLv2_submenus };
    });
    setMenuLv1({..._menuLv1, submenus: menuLv1_submenus});

    setCurrMenu(menuAll?.find(item => router?.pathname.startsWith(item.pathname)));
  }, [menuAll, router.pathname]);
  
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
      <Provider store={storeAlert}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        
        <Message popupType="error" />

        <Main $isSidebarPinned={isSidebarPinned} $isTopbarFix={isTopbarFix}>
        
          <div className={`sidebar ${isSidebarOpen || isSidebarPinned ? 'open' : ''}`}>
            <SidebarMenu menuLv1={menuLv1}
              setMenuLv1={setMenuLv1} 
              isSidebarOpen={isSidebarOpen}
              isSidebarPinned={isSidebarPinned}
              toggleSidebarOpen={toggleSidebarOpen}
              toggleSidebarPinned={toggleSidebarPinned} />
          </div>


          <div className="header">
            <div className="logo">
              <a href="/"><span className="icon">🪶</span></a>
            </div>

            <div className="site">
            </div>
            
            <User isLogin={isLogin} initMain={init} user={user} />
          </div>
          
          <div className="topbar">
            <div className="sidebar-pin-button">
              {isSidebarPinned || true && <button onClick={() => toggleSidebarPinned()} tabIndex={10} />}
            </div>
            <div className="topbar-menu">
              <ul>
                {menuAll && menuAll?.length > 0 && 
                  menuAll?.map((item, index) => {
                    return (
                      <li className={`${item.mid === currMenu?.mid ? 'active' : ''}`} key={item.mid}>
                        <a href={item.pathname} className={`${item.mid === currMenu?.mid ? 'active' : ''}`} tabIndex={10+index} >
                          <span>{item.icon}</span>{item.title}</a>
                      </li>
                    );
                  })
                }
              </ul>
            </div>
          </div>

          <div className="contents">
            <Component {...pageProps} />
          </div>
        </Main>
      </Provider>
    </>
  );
};

const Main = styled.main<{ $isSidebarPinned: boolean, $isTopbarFix: boolean }>`
  // background-color: rgb(246, 248, 250);
  // border: 1px solid red;
  // margin: auto;
  // min-height: 100vh;
  
  display: grid;
  grid-template-columns: ${({ $isSidebarPinned }) => ($isSidebarPinned ? "250px auto" : "0 auto")}; 
  grid-template-rows: 60px 50px auto;  /* 3개의 행 크기 설정 */
  grid-template-columns: 250px auto;   /* 2개의 열 (사이드바, 메인 컨텐츠) */
  min-height: 100vh;
  transition: grid-template-columns 0.3s ease;

  /* sidebar */
  .sidebar {
    grid-row: 2 / 4; /* 전체 높이를 차지 */
    grid-column: 1 / 2; /* 왼쪽에 배치 */
  };

  /* header */
  .header {
    background-color: rgb(246, 248, 250);
    width: 100%;
    height: 60px;
    display: flex;
    grid-row: 1 / 2; /* 첫 번째 행 */
    grid-column: 1 / 3; /* 전체 너비 차지 */
    // grid-column: ${({ $isSidebarPinned }) => ($isSidebarPinned ? "2 / 3" : "1 / 3")};
  };
  .logo {
    margin: 20px 20px;
    display: flex;
    align-items: center;
  };
  .logo a {
    text-decoration: none;
  };
  .logo a span {
    font-size: 30px;
    cursor: pointer;
  };
  .site {
    display: flex;
    width: 100%;
  };
  .site-items {
    // border: 1px solid cyan;
    display: flex;
    flex: 1;
    flex-grow: 1;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
  };
  .site-items > ul {
    // border: 1px solid red;
    width: 100%;
    padding: 0;
    margin: 10px 0;
    display: flex;
    justify-content: space-around;
  };
  .site-items > ul > li {
    display: inline;
  };

  /* topbar */
  .topbar {
    width: 100%;
    height: 56px;
    top: 0;
    left: 0;
    box-sizing: border-box;
    position: ${({ $isTopbarFix }) => ($isTopbarFix ? "fixed" : "relative")};
    background-color: ${({ $isTopbarFix }) => ($isTopbarFix ? "lightgray" : "white")};
    display: flex;
    border-bottom: 1px solid #f2f4f7;
    z-index: ${({ $isTopbarFix }) => ($isTopbarFix ? 11 : 1)};
    grid-row: 2 / 3; /* 두 번째 행 */
    // grid-column: 1 / 3; /* 전체 너비 차지 */
    grid-column: ${({ $isSidebarPinned }) => ($isSidebarPinned ? "2 / 3" : "1 / 3")};
  };
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

  .sidebar-pin-button {
    // position: fixed;
    // top: 0;
    // left: 0;
    // border: 1px solid blue;
    // margin: 20px 20px;
    display: flex;
    column-gap: 10px;
    align-items: center;
  };
  .sidebar-pin-button > button {
    width: 35px;
    height: 35px;
    margin: 12px 10px 12px 10px;
    background-color: rgb(246, 248, 250);
    border: 1px solid lightgray;
    display: grid;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 5px;
    // background: var(--btn-pinned-icon) no-repeat center / 24px 24px;
    background: ${({ $isSidebarPinned }) => ($isSidebarPinned ? "var(--btn-unpinned-icon) no-repeat center / 16px 16px" : "var(--btn-pinned-icon) no-repeat center / 16px 16px")};
    &:hover {
      background-color: rgb(239, 239, 239);
    };
  };

  .contents {
    // background: #f2f4f7;
    // margin: 20px;
    flex-direction: column;
    width: 100%;
    text-align: left;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    grid-row: 3 / 4; /* 세 번째 행 */
    // grid-column: 1 / 3; /* 메인 컨텐츠 영역 (사이드바 제외) */
    grid-column: ${({ $isSidebarPinned }) => ($isSidebarPinned ? "2 / 3" : "1 / 3")};
  };

`;


export default AppStructer;

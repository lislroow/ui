import { AppProps } from 'next/app';
import { useRouter } from "next/router";
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Provider } from 'react-redux';
import storeAlert from '@/redux/store-alert';

import '@/css/globals.css';
import User from "@/components/main/User";
import Sidebar from "@/components/main/Sidebar";
import Topbar from "@/components/main/Topbar";
import { MenuType } from "@/types/main/MenuTypes";
import { UserType } from "@/types/main/UserTypes";
import storage from "@/utils/storage";
import UserService from "@/services/main/UserService";
import CommonCodeService from "@/services/main/CodeService";
import Message from "@/components/main/Message";

const AppStructer = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [ user, setUser ] = useState<UserType>({});
  const [ isLogin, setLogin ] = useState<boolean>(false);
  const [ isSidebarOpen, setSidebarOpen ] = useState(false);
  const [ menuAll, setMenuAll ] = useState<MenuType[]>();
  const [ menuLv1, setMenuLv1 ] = useState<MenuType>();

  const toggleSidebar = (isTrue: boolean) => {
    if (isTrue) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    setSidebarOpen(isTrue);
  };
  
  const init = () => {
    CommonCodeService.initAllCodes();
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

    const _menuAll: MenuType[] = [
      {mid: "1", title: 'prototype', icon: '🍉', pathname: '/prototype', submenus: [
        {mid: "11", title: 'fund', icon: '', pathname: '/prototype/fund/fund-mng'},
        {mid: "12", title: 'mybatis', icon: '', pathname: '/prototype/mybatis', submenus: [
          {mid: "121", title: 'scientist', icon: '', pathname: '/prototype/mybatis/scientist/scientist-mng'},
        ]},
        {mid: "13", title: 'jpa', icon: '', pathname: '/prototype/jpa', submenus: [
          {mid: "131", title: 'planet', icon: '', pathname: '/prototype/jpa/planet/planet-mng'},
          {mid: "132", title: 'satellite', icon: '', pathname: '/prototype/jpa/satellite/satellite-mng'},
        ]},
        {mid: "14", title: 'system', icon: '', pathname: '/prototype/system', submenus: [
          {mid: "141", title: 'code', icon: '', pathname: '/prototype/system/code-mng'},
          {mid: "142", title: 'error log', icon: '', pathname: '/prototype/system/error-log'},
        ]},
      ]},
      {mid: "2", title: 'docs', icon: '🥕', pathname: '/docs'},
    ];
    setMenuAll(_menuAll);
  };

  useEffect(() => {
    init();
  }, [router.query]);

  useEffect(() => {
    const _menuLv1 = menuAll?.find(lv1 => router?.pathname.startsWith(lv1.pathname));

    const menuLv1_submenus = _menuLv1?.submenus?.map(menuLv2 => {
      const menuLv2_isOpen = router?.pathname.startsWith(menuLv2.pathname);
      const menuLv2_isActive = router?.pathname.startsWith(menuLv2.pathname);
      const menuLv2_submenus = menuLv2.submenus?.map(menuLv3 => {
        const menuLv3_isActive = router?.pathname.startsWith(menuLv3.pathname);
        return { ...menuLv3, isActive: menuLv3_isActive };
      });
      return { ...menuLv2, isOpen: menuLv2_isOpen, isActive: menuLv2_isActive, submenus: menuLv2_submenus };
    });
    setMenuLv1({..._menuLv1, submenus: menuLv1_submenus});
  }, [menuAll, router.pathname]);

  return (
    <>
      <Provider store={storeAlert}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        
        <Sidebar menuLv1={menuLv1} setMenuLv1={setMenuLv1} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <Message popupType="error" />

        <Main>
          <div className="header">
            <div className="logo">
              <a href="/"><span className="icon">🪶</span></a>
            </div>

            <div className="site">
            </div>
            
            <User isLogin={isLogin} initMain={init} user={user} />
          </div>
          
          <Topbar menuList={menuAll} toggleSidebar={toggleSidebar} />

          <Content>
            <Component {...pageProps} />
          </Content>
        </Main>
      </Provider>
    </>
  );
};

const Main = styled.main`
  // background-color: rgb(246, 248, 250);
  // border: 1px solid red;
  margin: auto;
  min-height: 100vh;

  .header {
    background-color: rgb(246, 248, 250);
    width: 100%;
    height: 60px;
    display: flex;
    flex-direction: row;
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
  .site_items {
    // border: 1px solid cyan;
    display: flex;
    flex: 1;
    flex-grow: 1;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
  };
  .site_items ul {
    // border: 1px solid red;
    width: 100%;
    padding: 0;
    margin: 10px 0;
    display: flex;
    justify-content: space-around;
  };
  .site_items ul > li {
    display: inline;
  };
`;

const Content = styled.div`
  // background: #f2f4f7;
  width: 100%;
  text-align: left;
  padding: 10px;
  box-sizing: border-box;
`;

export default AppStructer;

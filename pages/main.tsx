import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import User from "@/components/main/User";
import Sidebar from "@/components/main/Sidebar";
import Topbar from "@/components/main/Topbar";

const Main = styled.main`
  // background-color: rgb(246, 248, 250);
  // border: 1px solid red;
  margin: auto;
  min-height: 100vh;
  
  a {
    text-decoration: none;
    color: #888;
  };
  a:hover {
    text-decoration: underline;
  };

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

const Page = () => {
  const [isLogin, setLogin] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [menu, setMenu] = useState<{ label?: string; icon?: string }>();
  const [menuList, setMenuList] = useState<{ label?: string; icon?: string }[]>();

  const toggleSidebar = (isTrue: boolean) => {
    if (isTrue) 
      document.body.style.overflow = 'hidden';
    else
      document.body.style.overflow = '';
    setSidebarOpen(isTrue);
  };

  useEffect(() => {
    const mlist = [{label: 'applications', icon: '🍉'}, {label: 'docs', icon: '🥕'}];
    setMenuList(mlist);
    setMenu(mlist[0]);
    setLogin(false);
  }, []);

  return (
    <>
      <Head>
        <title>develop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Sidebar menu={menu} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <Main>
        <div className="header">
          <div className="logo">
            <a href=""><span className="icon">🪶</span></a>
          </div>

          <div className="site">
          </div>
          
          <User isLogin={isLogin} />
        </div>
        
        <Topbar menu={menu} menuList={menuList} toggleSidebar={toggleSidebar} />

        <Content>
            <ul>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
              <li><a href="/"><span>java</span></a></li>
            </ul>
        </Content>
      </Main>
    </>
  );
};

export default Page;

import styled from 'styled-components';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

const Header = styled.header`
  background-color: rgb(246, 248, 250);
  // border: 1px solid red;
  height: 110px;
  margin: auto;
  // width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
  .menus {
    position: absolute;
    top: 0;
    left: 0;
    // border: 1px solid blue;
    margin: 20px 20px;
    display: flex;
    column-gap: 10px;
    align-items: center;
  };
  .btn_open_sidebar {
    width: 35px;
    height: 35px;
    background-color: rgb(246, 248, 250);
    border: 1px solid lightgray;
    display: grid;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 5px;
  };
  .btn_open_sidebar:hover {
    background-color: rgb(239, 239, 239);
  };
  

  .links {
    position: absolute;
    top: 0;
    right: 0;
    // border: 1px solid red;
    margin: 10px 20px;
    display: flex;
    column-gap: 10px;
    align-items: center;
  };
  .link_text {
    font-size: 12px;
  };
  .links span {
    color: #888;
  };
  .links button:hover {
    cursor: pointer;
  };
  a {
    text-decoration: none;
    color: #888;
  };
  a:hover {
    text-decoration: underline;
  };

  fieldset {
    border: none;
  };
  .visually-hidden {
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
    white-space: nowrap;
  };
  .search_box {
    height: 30px;
    border: 2px solid #1ab9c1;
    background-color: white;
    display: flex;
    align-items: center;
  };
  .search_box input {
    width: 50vw;
    max-width: 400px;
    padding-left: 12px;
    padding-right: 12px;
    border: none;
    outline: none;
    font-size: 16px;
  };
  .search_box button {
    height: 30px;
    width: 60px;
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    background: #1ab9c1;
    color: #ffffff;
  };
  .search_box button:hover {
    cursor: pointer;
  };


  .nav_items {
    // border: 1px solid cyan;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  };
  .nav_items ul {
    // border: 1px solid red;
    padding: 0 5%;
    
    display: flex;
    justify-content: space-between;
    align-items: center;
  };
  .nav_items ul > li {  
    display: inline;
  };
  .nav_items ul > li > a {
    display: flex;
    font-size: 16px;
    column-gap: 6px;
  };


`;

const Main = styled.main`
  // background: #f2f4f7;
  min-height: 300px;
`;

const Footer = styled.footer`
  background-color: darkgray;
  height: 310px;
`;

const Sidebar = styled.div`
  top: 0;
  left: min(-30vw, -220px);
  width: 30vw;
  min-width: 220px;
  min-height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;
  // border: 2px solid red;
  position: fixed;
  transition: 0.05s ease;
  z-index: 10;
  background-color: white;
  border-radius: 0 10px 10px 0;
  &.open {
    left: 0;
    box-shadow: 3px 0px 20px rgba(0, 0, 0, 0.2);
  }
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  };

  .btn_close_sidebar {
    width: 35px;
    height: 35px;
    display: grid;
    align-items: center;
    justify-content: center;
    top: 20px;
    right: 20px;
    position: absolute;
    cursor: pointer;
    background-color: white;
    border: 0px solid lightgray;
    border-radius: 5px;
  };
  .btn_close_sidebar:hover {
    background-color: rgb(246, 248, 250);
  };
  ul {
    padding: 20px;
    top: 40px;
    left: 0;
    position: absolute;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    width: 158px;
    box-sizing: border-box;
  };
  ul > li {
    display: inline;
  };
  ul > li > a {
    font-size: 16px;
    text-decoration: none;
    color: #888;
  };
  ul > li > a:hover {
    text-decoration: underline;
  };
  .sidebar-divider {
    background-color: #e1e4e8;
    height: 1px;
    width: 190px;
    display: block;
    margin: 0;
  }
  
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-in-out;
  z-index: 9;
  &.active {
    opacity: 1;
    visibility: visible;
  }
`;

const Page = () => {
  const [sideOpen, setSideOpen] = useState(false);
  const sidebarOut = useRef<any>();

  useEffect(() => {
    document.addEventListener('mousedown', handlerSidebarClose);
    return () => {
      document.removeEventListener('mousedown', handlerSidebarClose);
    };
  });
  const handlerSidebarClose = (e: any) => {
    if (!sidebarOut.current.contains(e.target)) {
      toggleSidebar(false);
    }
  };
  const toggleSidebar = (open: boolean) => {
    if (open) 
      document.body.style.overflow = 'hidden';
    else
      document.body.style.overflow = '';
    setSideOpen(open);
  }

  return (
    <>
      <Head>
        <title>naver</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Sidebar className={sideOpen ? 'open' : ''} ref={sidebarOut}>
        <button className="btn_close_sidebar" onClick={() => toggleSidebar(false)}>
          <svg viewBox="0 0 16 16" width="1.5em" height="1.5em">
            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
          </svg>
        </button>
        <ul>
          <li><a href="/"><span>카페</span></a></li>
          <li><a href="/">블로그</a></li>
          <li><a href="/">지식iN</a></li>
          <li><a href="/">쇼핑</a></li>
          <li className="sidebar-divider"></li>
          <li><a href="/">Pay</a></li>
          <li><a href="/">TV</a></li>
        </ul>
      </Sidebar>
      <Overlay className={sideOpen ? 'active' : ''}></Overlay>
      <Header>
        <div className="menus">
          <button className="btn_open_sidebar" onClick={() => toggleSidebar(true)}>
            <svg viewBox="0 0 16 16" width="1.5em" height="1.5em">
              <path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z"></path>
            </svg>
          </button>
        </div>

        {/* header-1 */}
        <div className="links">
          <a href="/" className="link_text">
            홍길동
          </a>
          <button className="btn_logout">로그아웃</button>
        </div>

        {/* <form>
          <fieldset>
            <legend className="visually-hidden">검색</legend>
            <div className="search_box">
              <input type="text" maxLength={255} tabIndex={1} />
              <button type="submit" tabIndex={2}>
                검색
              </button>
            </div>
          </fieldset>
        </form> */}

        <nav>
          <div className="nav_items">
            <ul>
              <li><a href="/"><span>카페</span></a></li>
              <li><a href="/">블로그</a></li>
              <li><a href="/">지식iN</a></li>
              <li><a href="/">쇼핑</a></li>
              <li><a href="/">Pay</a></li>
              <li><a href="/">TV</a></li>
            </ul>
          </div>
        </nav>
      </Header>
      <Main>
        main
      </Main>
      <Footer>footer</Footer>
    </>
  );
};

export default Page;

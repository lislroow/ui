import styled from 'styled-components';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

const Main = styled.main`
  // background-color: rgb(246, 248, 250);
  // border: 1px solid red;
  height: 110px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 100vh;
  top: 0;
  left: 0;
  
  .header {
    background-color: rgb(246, 248, 250);
    width: 100%;
    height: 100px;
  };
  
  .menus {
    position: fixed;
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

  nav {
    display: flex;
    width: 100%;
    height: 100px;
    // border: 1px solid red;
    // background-color: rgb(246, 248, 250);
  };
  .nav_items {
    // border: 1px solid cyan;
    
    display: flex;
    flex: 1;
    flex-grow: 1;
    justify-content: space-evenly;
    align-items: flex-end;
    width: 100%;
  };
  .nav_items ul {
    // border: 1px solid red;
    width: 100%;
    padding: 0;
    margin: 10px 0;
    display: flex;
    justify-content: space-around;
  };
  .nav_items ul > li {
    display: inline;
  };
  .nav_items ul > li > a {
  };
`;

const Content = styled.div`
  // background: #f2f4f7;
  background-color: white;
  width: 100%;
  text-align: left;
`;

const Sidebar = styled.div`
  .sidebar-menu {
    top: 0;
    left: -100vw;
    width: 30vw;
    min-width: 220px;
    min-height: 100vh;
    max-height: 100vh;
    overflow-y: auto;
    box-sizing: border-box;
    // border: 2px solid red;
    position: fixed;
    transition: 0.1s ease;
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
  };
  .sidebar-overlay {
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
    };
  };
`;


const User = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  // border: 1px solid blue;
  display: flex;
  column-gap: 10px;
  align-items: center;
  
  .user-avatar {
    width: 35px;
    height: 35px;
    margin: 20px 20px;
  };
  .user-avatar:hover {
    cursor: pointer;
  };
  .user-menu {
    position: fixed;
    top: 60px;
    right: -100vw;
    transition: 0.2s ease;
    padding: 10px;
    border-radius: 10px 0 0 10px;
    background-color: white;
    z-index: 100;
    // border: 1px solid blue;
    
    width: 30vw;
    min-width: 250px;
    &.open {
      right: 0;
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

  };
  .user-menu-divider {
    border: none;
    height: 1px;
    background: #ddd;
    margin: 10px 0;
  };
  .user-menu-profile {
    display: flex;
    column-gap: 10px;
    align-items: center;
  };
  .user-menu-profile-avatar {
    width: 35px;
    height: 35px;
    display: grid;
    // border: 1px solid cyan;
  };
  .user-menu-profile-info {
    display: flex;
    flex-direction: column;
    // border: 1px solid red;
    };
  .user-menu-profile-info > p {
    margin: 0;
    padding: 0;
  };
  .user-menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
  };
  .user-menu-list > li {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    font-size: 14px;
    border-radius: 5px;
    // border: 1px solid green;
  };
  .user-menu-list > li:hover {
    background: #f1f1f1;
  };
  .icon {
    margin-right: 10px;
    font-size: 16px;
  };
`;

const Page = () => {
  const [sideOpen, setSideOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const sidebarOut = useRef<any>();
  const userOut = useRef<any>();

  useEffect(() => {
    document.addEventListener('mousedown', handlerSidebarClose);
    return () => {
      document.removeEventListener('mousedown', handlerSidebarClose);
    };
  });
  const handlerSidebarClose = (e: any) => {
    if (sideOpen && !sidebarOut.current.contains(e.target)) {
      toggleSidebar(false);
    }
  };
  const toggleSidebar = (open: boolean) => {
    if (open) 
      document.body.style.overflow = 'hidden';
    else
      document.body.style.overflow = '';
    setSideOpen(open);
  };
  const toggleUser = () => {
    if (userOpen) 
      document.body.style.overflow = 'hidden';
    else
      document.body.style.overflow = '';
    setUserOpen(!userOpen);
  };
  const useDisableScroll = (isDisabled: boolean) => {
    useEffect(() => {
      if (isDisabled) {
        const preventScroll = (event: Event) => event.preventDefault();
        const preventKeyboardScroll = (event: KeyboardEvent) => {
          const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]; // 방향키 + 스페이스바
          if (keys.includes(event.key)) {
            event.preventDefault();
          }
        };
  
        window.addEventListener("wheel", preventScroll, { passive: false });
        window.addEventListener("touchmove", preventScroll, { passive: false });
        window.addEventListener("keydown", preventKeyboardScroll);
  
        return () => {
          document.body.style.overflow = ""; // 원래 상태로 복구
          document.body.style.paddingRight = "";
          window.removeEventListener("wheel", preventScroll);
          window.removeEventListener("touchmove", preventScroll);
          window.removeEventListener("keydown", preventKeyboardScroll);
        };
      }
    }, [isDisabled]);
  };
  useDisableScroll(userOpen);

  return (
    <>
      <Head>
        <title>naver</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Sidebar>
        <div className={sideOpen ? 'open sidebar-menu' : 'sidebar-menu'} ref={sidebarOut}>
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
        </div>
        <div className={sideOpen ? 'active sidebar-overlay' : 'sidebar-overlay'}></div>
      </Sidebar>

      <Main>
        <div className="header">
          <div className="menus">
            <button className="btn_open_sidebar" onClick={() => toggleSidebar(true)}>
              <svg viewBox="0 0 16 16" width="1.5em" height="1.5em">
                <path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z"></path>
              </svg>
            </button>
          </div>

          {/* header-1 */}
          {/* <div className="links">
            <a href="/" className="link_text">
              홍길동
            </a>
            <button className="btn_logout">로그아웃</button>
          </div> */}

          <User>
            <div className="user-avatar" onClick={() => toggleUser()}>
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="#E0E0E0" stroke="#BDBDBD" stroke-width="2"/>
                <circle cx="50" cy="35" r="15" fill="#9E9E9E"/>
                <path d="M30 80 C30 60, 70 60, 70 80 Z" fill="#9E9E9E"/>
              </svg>
            </div>

            <div className={userOpen ? 'open user-menu' : 'user-menu'} ref={userOut}>
              <div className="user-menu-profile">
                <div className="user-menu-profile-avatar">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="#E0E0E0" stroke="#BDBDBD" stroke-width="2"/>
                    <circle cx="50" cy="35" r="15" fill="#9E9E9E"/>
                    <path d="M30 80 C30 60, 70 60, 70 80 Z" fill="#9E9E9E"/>
                  </svg>
                </div>
                <div className="user-menu-profile-info">
                  <p>코딩맛집</p>
                  <p>@코딩맛집-n8d</p>
                  <a href="#" className="view-channel">내 채널 보기</a>
                </div>
              </div>
              
              <hr className="user-menu-divider" />

              <ul className="user-menu-list">
                <li><span className="icon">🔗</span>Google 계정</li>
                <li><span className="icon">🔄</span>계정 전환</li>
                <li><span className="icon">🚪</span>로그아웃</li>
              </ul>
              
              <hr className="user-menu-divider" />

              <ul className="user-menu-list">
                <li><span className="icon">🎥</span>YouTube 스튜디오</li>
                <li><span className="icon">🛒</span>구매 항목 및 멤버십</li>
                <li><span className="icon">📂</span>YouTube의 내 데이터</li>
              </ul>

            </div>
          </User>

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
        </div>

        <Content>
          <ul>
            <li><a href="/"><span>카페</span></a></li>
            <li><a href="/">블로그</a></li>
            <li><a href="/">지식iN</a></li>
            <li><a href="/">쇼핑</a></li>
            <li><a href="/">Pay</a></li>
            <li><a href="/">TV</a></li>
          </ul>
          <ul>
            <li><a href="/"><span>카페</span></a></li>
            <li><a href="/">블로그</a></li>
            <li><a href="/">지식iN</a></li>
            <li><a href="/">쇼핑</a></li>
            <li><a href="/">Pay</a></li>
            <li><a href="/">TV</a></li>
          </ul>
          <ul>
            <li><a href="/"><span>카페</span></a></li>
            <li><a href="/">블로그</a></li>
            <li><a href="/">지식iN</a></li>
            <li><a href="/">쇼핑</a></li>
            <li><a href="/">Pay</a></li>
            <li><a href="/">TV</a></li>
          </ul>
          <ul>
            <li><a href="/"><span>카페</span></a></li>
            <li><a href="/">블로그</a></li>
            <li><a href="/">지식iN</a></li>
            <li><a href="/">쇼핑</a></li>
            <li><a href="/">Pay</a></li>
            <li><a href="/">TV</a></li>
          </ul>
          <ul>
            <li><a href="/"><span>카페</span></a></li>
            <li><a href="/">블로그</a></li>
            <li><a href="/">지식iN</a></li>
            <li><a href="/">쇼핑</a></li>
            <li><a href="/">Pay</a></li>
            <li><a href="/">TV</a></li>
          </ul>
          <ul>
            <li><a href="/"><span>카페</span></a></li>
            <li><a href="/">블로그</a></li>
            <li><a href="/">지식iN</a></li>
            <li><a href="/">쇼핑</a></li>
            <li><a href="/">Pay</a></li>
            <li><a href="/">TV</a></li>
          </ul>
          <ul>
            <li><a href="/"><span>카페</span></a></li>
            <li><a href="/">블로그</a></li>
            <li><a href="/">지식iN</a></li>
            <li><a href="/">쇼핑</a></li>
            <li><a href="/">Pay</a></li>
            <li><a href="/">TV</a></li>
          </ul>
          <ul>
            <li><a href="/"><span>카페</span></a></li>
            <li><a href="/">블로그</a></li>
            <li><a href="/">지식iN</a></li>
            <li><a href="/">쇼핑</a></li>
            <li><a href="/">Pay</a></li>
            <li><a href="/">TV</a></li>
          </ul>
          <ul>
            <li><a href="/"><span>카페</span></a></li>
            <li><a href="/">블로그</a></li>
            <li><a href="/">지식iN</a></li>
            <li><a href="/">쇼핑</a></li>
            <li><a href="/">Pay</a></li>
            <li><a href="/">TV</a></li>
          </ul>
        </Content>
      </Main>
    </>
  );
};

export default Page;

import styled from 'styled-components';
import Head from 'next/head';
import { useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from "@/styles/SidebarStyled";

const Main = styled.main`
  // background-color: rgb(246, 248, 250);
  // border: 1px solid red;
  margin: auto;
  // align-items: stretch;
  min-height: 100vh;
  // top: 0;
  // left: 0;
  
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
    height: 50px;
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
  .sidebar-open-button button {
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
  .sidebar-open-button button:hover {
    background-color: rgb(239, 239, 239);
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
  .site_items ul > li > a {
  };

  .user {
    // position: fixed;
    // top: 0;
    // right: 0;
    // border: 1px solid blue;
    display: flex;
    align-items: center;
  };
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
    top: 50px;
    right: -100vw;
    transition: 0.2s ease;
    padding: 10px;
    border-radius: 10px 0 0 10px;
    background-color: white;
    z-index: 100;
    // border: 1px solid blue;
    
    width: min(50vw, 250px);
    min-width: min(50vw, 250px);
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

const Topbar = styled.div<{ $topbarFix: boolean }>`
  width: 100%;
  height: 50px;
  position: ${({ $topbarFix }) => ($topbarFix ? "fixed" : "relative")};
  top: 0;
  left: 0;
  background-color: ${({ $topbarFix }) => ($topbarFix ? "lightgray" : "white")};
  display: flex;
  border-bottom: 1px solid #f2f4f7;
  
  .items {
    // border: 1px solid cyan;
    display: flex;
    flex: 1;
    flex-grow: 1;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
  };
  .items ul {
    // border: 1px solid red;
    width: 100%;
    padding: 0;
    margin: 10px 0;
    display: flex;
    justify-content: space-around;
  };
  .items ul > li {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    font-size: 14px;
    border-radius: 5px;
    // border: 1px solid green;
    &.active {
      background:rgb(200, 200, 200);
    };
  };
  .items ul > li:hover {
    background:rgb(222, 222, 222);
  };
  .items ul > li > a {
    text-decoration: none;
    color: ${({ $topbarFix }) => ($topbarFix ? "white" : "black")};
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
  const [sideOpen, setSideOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const sidebarOutside = useRef<any>();
  const userOutside = useRef<any>();
  const userButton = useRef<any>();
  const topbar = useRef<any>();
  const [topbarFix, setTopbarFix] = useState(false);
  const [topMenu, setTopMenu] = useState('');
  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    document.addEventListener('mousedown', handlerSidebarClose);
    return () => {
      document.removeEventListener('mousedown', handlerSidebarClose);
    };
  });
  const handlerSidebarClose = (e: any) => {
    if (sideOpen && !sidebarOutside.current.contains(e.target)) {
      toggleSidebar(false);
    } else if (userOpen && !userOutside.current.contains(e.target) &&
      userOpen && !userButton.current.contains(e.target)) {
      toggleUser();
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
          const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
          if (keys.includes(event.key)) {
            event.preventDefault();
          }
        };
        
        window.addEventListener("wheel", preventScroll, { passive: false });
        window.addEventListener("touchmove", preventScroll, { passive: false });
        window.addEventListener("keydown", preventKeyboardScroll);
  
        return () => {
          document.body.style.overflow = "";
          document.body.style.paddingRight = "";
          window.removeEventListener("wheel", preventScroll);
          window.removeEventListener("touchmove", preventScroll);
          window.removeEventListener("keydown", preventKeyboardScroll);
        };
      }
    }, [isDisabled]);
  };
  useDisableScroll(userOpen);

  const useTopbarFix = () => {
    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        // setTopbarFix((prev) => (prev !== !entry.isIntersecting ? !entry.isIntersecting : prev));
        const status = (prev) => (prev !== !entry.isIntersecting ? !entry.isIntersecting : prev);
        toogleTopbarFix(status);
      }, { threshold: 0 });
      if (topbar.current) {
        observer.observe(topbar.current);
      }
      return () => {
        if (topbar.current) {
          observer.unobserve(topbar.current);
        }
      };
    }, []);
  };
  useTopbarFix();
  const toogleTopbarFix = (status: any) => {
    setTopbarFix(status);
  };

  useEffect(() => {
    const mlist = ['java', 'spring', 'react', 'linux', 'python', 'docker'];
    setMenuList(mlist);
    setTopMenu('spring');
  }, []);

  return (
    <>
      <Head>
        <title>naver</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Sidebar>
        <div className={sideOpen ? 'open sidebar-menu' : 'sidebar-menu'} ref={sidebarOutside}>
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
          <div className="logo">
            <a href=""><span className="icon">🪶</span></a>
          </div>

          <div className="site">
            {/* <div className="site_items">
              <ul>
                <li><a href="/main"><span>spring</span></a></li>
              </ul>
            </div> */}
          </div>
          
          <div className="user">
            <span>21:11</span>
            <div className="user-avatar" onClick={() => toggleUser()} ref={userButton}>
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="#E0E0E0" stroke="#BDBDBD" />
                <circle cx="50" cy="35" r="15" fill="#9E9E9E"/>
                <path d="M30 80 C30 60, 70 60, 70 80 Z" fill="#9E9E9E"/>
              </svg>
            </div>

            <div className={userOpen ? 'open user-menu' : 'user-menu'} ref={userOutside}>
              <div className="user-menu-profile">
                <div className="user-menu-profile-avatar">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="#E0E0E0" stroke="#BDBDBD" />
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
          </div>
        </div>
        
        <div ref={topbar} style={{ height: "0px", background: "transparent" }}></div>
        <Topbar $topbarFix={topbarFix}>
          <div className="sidebar-open-button">
            <button onClick={() => toggleSidebar(true)}>
              <svg viewBox="0 0 16 16" width="1.5em" height="1.5em">
                <path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z"></path>
              </svg>
            </button>
          </div>
          <div className="items">
            <ul>
              {menuList && 
                menuList.map((item, index) => {
                  return (
                    <li className={item === topMenu ? 'active' : ''} key={index}><a href="/"><span>{item}</span></a></li>
                  );
                })
              }
            </ul>
          </div>
        </Topbar>

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

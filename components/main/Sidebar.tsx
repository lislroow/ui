import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { MenuType } from "@/types/MenuTypes";
import { useRouter } from "next/router";

interface SidebarProps {
  menuLv1: MenuType;
  setMenuLv1: React.Dispatch<React.SetStateAction<MenuType>>;
  isSidebarOpen: boolean;
  toggleSidebar: (isTrue: boolean) => void;
};

const Sidebar: React.FC<SidebarProps> = ({menuLv1, setMenuLv1, isSidebarOpen, toggleSidebar}) => {
  const refSidebar = useRef<any>();
  useEffect(() => {
    const handleMousedown = (e: any) => {
      if (isSidebarOpen && !refSidebar.current.contains(e.target)) {
        toggleSidebar(false);
      }
    };
    document.addEventListener('mousedown', handleMousedown);
    return () => {
      document.removeEventListener('mousedown', handleMousedown);
    };
  }, [isSidebarOpen]);
  
  const toggleSideMenuOpen = (mid: string) => {
    const menuLv1_submenus = menuLv1.submenus.map(menuLv2 => {
      const menuLv2_isOpen = !menuLv2.isOpen;
      return menuLv2.mid === mid ? { ...menuLv2, isOpen: menuLv2_isOpen } : menuLv2;
    });
    setMenuLv1(prev => ({ ...prev, submenus: menuLv1_submenus }));
  };

  return (
    <SidebarStyled>
      <div className={isSidebarOpen ? 'open sidebar-menu' : 'sidebar-menu'} ref={refSidebar}>
        <div className="sidebar-top">
          {menuLv1 && (
            <div className="sidebar-title">
              <span>{menuLv1.icon}</span> {menuLv1.title}
            </div>
          )}
          <button className="btn_close_sidebar" onClick={() => toggleSidebar(false)}>
            <svg viewBox="0 0 16 16" width="1.5em" height="1.5em">
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
            </svg>
          </button>
        </div>
        <ul>
          {menuLv1?.submenus && 
            menuLv1?.submenus.map((menuLv2) => (
              <li key={menuLv2.mid} className={menuLv2.isActive ? 'active' : ''}>
                {menuLv2.submenus 
                ? (
                  <div className="menu-item" onClick={() => toggleSideMenuOpen(menuLv2.mid)}>
                    <div className={`${menuLv2.isOpen === true ? 'expand' : 'collapse'}`}></div>
                    <div>{menuLv2.title}</div>
                  </div>
                )
                : (
                  <div className="menu-item">
                    <div />
                    <div><a href={menuLv2.pathname}>{menuLv2.title}</a></div>
                  </div>
                )}
                {menuLv2.submenus && menuLv2.submenus?.length > 0 && (
                  <ul className={menuLv2.isOpen ? 'menu-item-submenu open' : 'menu-item-submenu'}>
                    {menuLv2.submenus.map((menuLv3) => (
                      <li key={menuLv3.mid} className={menuLv3.isActive === true ? 'active' : ''}>
                        <a href={menuLv3.pathname}><span>{menuLv3.icon}</span>{menuLv3.title}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))
          }
        </ul>
      </div>
      <div className={isSidebarOpen ? 'active sidebar-overlay' : 'sidebar-overlay'}></div>
    </SidebarStyled>
  );
};

const SidebarStyled = styled.div`
  .sidebar-menu {
    // top: 0;
    left: -100vw;
    width: min(300px, 60vw);
    min-width: min(300px, 60vw);
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
    display: grid;
    grid-template-rows: 60px auto;
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

  .sidebar-top {
    display: grid;
    grid-template-columns: auto 45px;
    align-items: center;
    justify-content: space-between;
    background-color: white;
  };
  .sidebar-title {
    padding: 0 20px;
    display: flex;
    align-items: center;
    column-gap: 5px;
    font-size: 20px;
    font-weight: bold;
  };
  .btn_close_sidebar {
    width: 35px;
    height: 35px;
    display: grid;
    align-items: center;
    justify-content: center;
    // margin-right: 10px;
    cursor: pointer;
    background-color: white;
    border: 0px solid lightgray;
    border-radius: 5px;
  };
  .btn_close_sidebar:hover {
    background-color: rgb(246, 248, 250);
  };

  .sidebar-menu > ul {
    list-style: none;
    grid-template-columns: 1fr;
    padding: 0;
    margin: 0;
  };
  .sidebar-menu > ul > li {
    &.active {
      background-color: rgb(243, 243, 243);
    };
  };

  div.menu-item {
    cursor: pointer;
    font-size: 16px;
    color: #333;
    border-bottom: 1px solid #e1e4e8;
    display: flex;
    align-items: center;
    &:hover {
      background-color: rgb(222, 222, 222);
    };
  };
  div.menu-item > div:nth-child(2) {
    flex: 1;
    &>a {
      color: #333;
      display: flex;
      flex: 1;
    };
  };
  div.menu-item > div:nth-child(1) {
    padding: 10px 10px;
    width: 16px;
    height: 16px;
    background-size: cover;
    &.expand {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><text x="5" y="34" font-size="20" fill="%231E88E5">➖</text></svg>');
    };
    &.collapse {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><text x="5" y="34" font-size="20" fill="%231E88E5">➕</text></svg>');
    };
  };
  div.menu-item > span {
    display: flex;
    &:hover {
      background-color: rgb(222, 222, 222);
      color: white;
    };
  };
  
  ul.menu-item-submenu {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.1s ease;
    &.open {
      max-height: 1000px;
      opacity: 1;
    };
  };
  ul.menu-item-submenu > li {
    // padding: 10px 50px;
    list-style: none;
    background: white;
    &.active {
      background-color: rgb(243, 243, 243);
    };
  };
  ul.menu-item-submenu > li > a {
    display: flex;
    padding: 10px 50px;
    &:hover {
      background-color: rgb(222, 222, 222);
      color: white;
    };
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

export default Sidebar;

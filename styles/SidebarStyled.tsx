import styled from "styled-components";

const Sidebar = styled.div`
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
    background-color: #f5f5f5;
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

  .menu-item {
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
    color: #333;
    border-bottom: 1px solid #e1e4e8;
    &:hover {
      background: #f1f1f1;
    };
  };
  .menu-item span {
    margin: 0 10px;
  };
  .menu-item-submenu {
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
  .menu-item-submenu li {
    padding: 10px 40px;
    list-style: none;
    &:hover {
      background: #f1f1f1;
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

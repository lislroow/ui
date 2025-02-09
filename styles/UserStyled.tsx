import styled from "styled-components";

const User = styled.div`
  // border: 1px solid blue;
  display: flex;
  align-items: center;
  
  .user-avatar {
    width: 35px;
    width: 35px;
    margin: 20px 20px;
    color: blue;
    &:hover {
      cursor: pointer;
    };
  };
  .user-login {
    width: 100px;
    height: 35px;
    margin: 20px 20px;
    color: blue;
    &:hover {
      cursor: pointer;
    };
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

export default User;

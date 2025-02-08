import styled from "styled-components";

const MainSearch = styled.div`
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
`;

export default MainSearch;

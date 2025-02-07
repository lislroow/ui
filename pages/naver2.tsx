import styled from 'styled-components';
import Head from 'next/head';

const Header = styled.header`
  background-color: white;
  // border: 1px solid red;
  height: 150px;
  margin: auto;
  // width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
  .links {
    position: absolute;
    top: 0;
    right: 0;
    // border: 1px solid red;
    margin: 2% 5%;
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
  .links button {
    height: 22px;
    width: 70px;
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    background: #1ab9c1;
    color: #ffffff;
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
    display: flex;
    align-items: center;
  };
  .search_box input {
    width: 50vw;
    padding-left: 12px;
    padding-right: 12px;
    border: none;
    outline: none;
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
    font-size: 12px;
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

const Page = () => {
  return (
    <>
      <Head>
        <title>naver</title>
      </Head>
      <Header>
        {/* header-1 */}
        {/* <div className="links">
          <a href="/" className="link_text">
            홍길동
          </a>
          <button className="btn_logout">로그아웃</button>
        </div> */}

        <form>
          <fieldset>
            <legend className="visually-hidden">검색</legend>
            <div className="search_box">
              <input type="text" maxLength={255} tabIndex={1} />
              <button type="submit" tabIndex={2}>
                검색
              </button>
            </div>
          </fieldset>
        </form>

        <nav>
          <div className="nav_items">
            <ul>
              <li>
                <a href="/">
                  <span>카페</span>
                </a>
              </li>
              <li>
                <a href="/">블로그</a>
              </li>
              <li>
                <a href="/">지식iN</a>
              </li>
              <li>
                <a href="/">쇼핑</a>
              </li>
              <li>
                <a href="/">Pay</a>
              </li>
              <li>
                <a href="/">TV</a>
              </li>
            </ul>
          </div>
        </nav>
      </Header>
      <Main>
        <a href="/">main</a>
      </Main>
      <Footer>footer</Footer>
    </>
  );
};

export default Page;

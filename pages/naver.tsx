import styled from 'styled-components';
import Head from 'next/head';

const Header = styled.header`
  background-color: lightgray;
  height: 215px;
  margin: auto;
  width: auto;
  display: flex;
  align-items: center;
  position: relative;

  /* header-1 */
  .links {
    position: absolute;
    top: 0;
    right: 0;
  };
  .link_text {
    font-size: 10px;
    margin-left: 5px;
  };
  a {
    text-decoration: none;
    color: #888;
  };
  a:hover {
    text-decoration: underline;
  };

  .img_logo {
    margin-bottom: 12px;
    // width: 220px;
    width: 120px;
    height: 65px;
  };

  /* header-2 */
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
    width: 520px;
    height: 48px;
    border: 2px solid #03cf5d;
    display: flex;
    align-items: center;
  };
  .search_box input {
    flex: 9;
    height: 46px;
    padding-left: 12px;
    padding-right: 12px;
    border: none;
    outline: none;
    font-size: 18px;
  };
  .search_box button {
    flex: 1;
    height: 50px;
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    background: #03cf5d;
    color: #ffffff;
  };

  /* header-3 */
  nav {
    width: 100%;
    height: 45px;
    position: absolute;
    bottom: 0;
  };
  .nav_items {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font: 15px bold;
    border-top: 1px solid #f1f3f6;
  };
  .nav_items ul > li {
    display: inline;
    margin-left: 8px;
  };
  .nav_items ul > li:nth-child(-n + 7) > a {
    color: #03cf5d;
  };
  .nav_items ul > li > a {
    // text-decoration: none;
    // cursor: pointer;
  };
`;

const Main = styled.main`
  background: #f2f4f7;
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
        <div className="links">
          <a href="/" className="link_text">
            네이버를 시작페이지로
          </a>
          <a href="/" className="link_text">
            쥬니어네이버
          </a>
          <a href="/" className="link_text">
            해피빈
          </a>
        </div>
        {/* header-2 */}
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
        {/* <a href="/">
          <img src="images/naver_logo.png" className="img_logo" />
        </a> */}
        {/*  header-3 */}
        <nav>
          <div className="nav_items">
            <ul>
              <li><a href="/">메일</a></li>
              <li><a href="/">카페</a></li>
              <li><a href="/">블로그</a></li>
              <li><a href="/">지식iN</a></li>
              <li><a href="/">쇼핑</a></li>
              <li><a href="/">Pay</a></li>
              <li><a href="/">TV</a></li>
              <li><a href="/">사전</a></li>
              <li><a href="/">뉴스</a></li>
              <li><a href="/">증권</a></li>
              <li><a href="/">부동산</a></li>
              <li><a href="/">지도</a></li>
              <li><a href="/">영화</a></li>
              <li><a href="/">뮤직</a></li>
              <li><a href="/">책</a></li>
              <li><a href="/">웹툰</a></li>
              <li><a href="/">더보기</a></li>
            </ul>
            <div className="keyword">
              <span className="color_naver">1</span>
              <span>Eoldam spark</span>
            </div>
          </div>
        </nav>
      </Header>
      <Main>main</Main>
      <Footer>footer</Footer>
    </>
  );
};

export default Page;

import styled from 'styled-components';
import Head from 'next/head';

const Header = styled.header`
  background-color: lightgray;
  height: 215px;
  
  .links {
  }
  .img_logo {
  }
`;

const MainWrap = styled.main`
  background: #f2f4f7;
  min-height: 300px;
`;

const FooterWrap = styled.footer`
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
        <a href="/"><img src="images/naver_logo.png" className="img_logo"/></a>
      </Header>
      <MainWrap>
        main
      </MainWrap>
      <FooterWrap>
        footer
      </FooterWrap>
    </>
  );
};

export default Page;

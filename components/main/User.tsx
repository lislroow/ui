import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import UserService from "@/services/main/UserService";
import cookie from "@/utils/kookie";
import storage from "@/utils/storage";
import { refreshToken } from "@/utils/http";
import { UserType } from "@/types/main/UserTypes";
import { useDisableScroll } from "@/utils/event";
import storeAlert, { showAlert } from "@/redux/store-alert";

interface UserProps {
  isLogin: boolean;
  initMain: () => void;
  user?: UserType;
};

const User: React.FC<UserProps> = ({isLogin, initMain, user}) => {
  const router = useRouter();
  const [ isMounted, setMounted ] = useState(false);
  const [ isLoginPopupOpen, setLoginPopupOpen ] = useState(false);
  const [ isUserPopupOpen, setUserPopupOpen ] = useState(false);
  const refUsername = useRef(null);
  const refLoginForm = useRef<any>();
  const refAvatarUser = useRef<any>();
  const refUserPopup = useRef<any>();
  
  const [username, setUsername] = useState('myeonggu.kim@kakao.com'); // manager
  const [password, setPassword] = useState('1');
  const [userType, setUserType] = useState('manager');

  const [ expireTime, setExpireTime ] = useState<number>();

  useEffect(() => {
    setMounted(true);
    const handleMousedown = (e: MouseEvent) => {
      if (isUserPopupOpen &&
        !refUserPopup.current.contains(e.target) && 
        e.button !== 2 &&
        !refAvatarUser.current.contains(e.target)) {
        toggleUserPopup();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        toggleUserPopup();
      }
    };
    if (isLoginPopupOpen) {
      document.addEventListener('mousedown', handleMousedown);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleMousedown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isLoginPopupOpen) {
      refUsername.current?.focus();
    }
  }, [isLoginPopupOpen]);

  const toggleUserPopup = () => {
    if (isUserPopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    setUserPopupOpen(!isUserPopupOpen);
  };
  
  const handleIdPwdLogin = () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    UserService.loginByIdPwd(userType, formData)
      .then(() => {
        const rtk = cookie.getCookie('X-RTK');
        storage.setX_RTK(rtk);
        refreshToken().then(() => initMain());
      })
      .catch(error => {
        storeAlert.dispatch(
          showAlert({
            title: error.response.data.title,
            message: error.response.data.detail,
            details: undefined,
          })
        );
        return Promise.reject(error);
      });
  };
  
  const handleSocialLogin = (social: string) => {
    switch (social) {
    case 'google':
    case 'kakao':
    case 'naver':
      break;
    default:
      console.log(`${social} login not allowed`);
      return;
    }
    router.push(`/auth-api/v1/member/login/oauth2/authorization/${social}`);
  };

  useEffect(() => {
    const remainTime = UserService.getRemainTime();
    setExpireTime(remainTime);
    const timer = setInterval(() => {
      const remainTime = UserService.getRemainTime();
      if (remainTime < 0) {
        const token = storage.getX_RTK();
        if (token) {
          clearInterval(timer);
          UserService.logout(router);
        }
      } else {
        setExpireTime(remainTime);
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [expireTime]);

  return (
    <>
      {isMounted && (
        <>
          <LoginPopupStyled className={isLoginPopupOpen == true ? 'open' : ''} 
            tabIndex={0} onKeyDown={(e) => {
              console.log(e.key);
              if (e.key === "Escape") setLoginPopupOpen((prev) => !prev);
            }}>
            <form>
              <div className="login-form" ref={refLoginForm}>
                <h2>로그인</h2>
                <div className="login-form-field">
                  <label>아이디</label>
                  <input type="text" value={username} placeholder="아이디" onChange={(e) => setUsername(e.target.value)} autoComplete="username" ref={refUsername} />
                  <label>패스워드</label>
                  <input type="password" value={password} placeholder="패스워드" onChange={(e) => setPassword(e.target.value)} autoComplete="password" />
                </div>
                <button onClick={(e) => handleIdPwdLogin()}>로그인</button>
              </div>
            </form>
          </LoginPopupStyled>
          
          <UserTopStyled>
            {isLogin == false
              ? (
                <div className="avatar-login" onClick={() => setLoginPopupOpen(true)}>
                  <svg viewBox="0 0 280 100" style={{width: "100px", height: "35px"}}>
                    <circle cx="50" cy="50" r="35" fill="#E0E0E0" />
                    <circle cx="50" cy="35" r="11" fill="#9E9E9E" />
                    <path d="M30 70 C30 45, 70 45, 70 70 Z" fill="#9E9E9E" />
                    <text x="120" y="65" fontSize="40" fill="#1E88E5">로그인</text>
                    <rect x="0" y="2" width="280" height="96" rx="48" ry="48" fill="none" stroke="#1E88E5" />
                  </svg>
                </div>
              )
              : (
                <>
                  <span style={{color: 'gray', fontSize: '14px'}}>
                    {String(Math.floor(expireTime / 60)).padStart(2, '0') + ':' + String(expireTime % 60).padStart(2, '0')}
                  </span>
                  <div className="btn-session-ext">
                    <button onClick={() => UserService.getInfo()}>연장</button>
                  </div>
                  <div className="avatar-user" onClick={() => toggleUserPopup()} ref={refAvatarUser}>
                    <svg viewBox="0 0 100 100" style={{width: "35px", height: "35px"}}>
                      <circle cx="50" cy="50" r="48" fill="#E0E0E0" stroke="#BDBDBD" />
                      <circle cx="50" cy="35" r="15" fill="#9E9E9E"/>
                      <path d="M30 80 C30 60, 70 60, 70 80 Z" fill="#9E9E9E"/>
                    </svg>
                  </div>
                </>
              )
            }
          </UserTopStyled>
          
          <UserPopupStyled>
            <div className={`user-menu ${isUserPopupOpen ? 'open' : ''}`} ref={refUserPopup}>
              <div className="user-menu-profile">
                <div className="user-menu-profile-avatar">
                  <svg viewBox="0 0 100 100" style={{width: "35px", height: "35px"}}>
                    <circle cx="50" cy="50" r="48" fill="#E0E0E0" stroke="#BDBDBD" />
                    <circle cx="50" cy="35" r="15" fill="#9E9E9E"/>
                    <path d="M30 80 C30 60, 70 60, 70 80 Z" fill="#9E9E9E"/>
                  </svg>
                </div>
                <div className="user-menu-profile-info">
                  <p>{user.username}</p>
                  <p>@코딩맛집-n8d</p>
                  <a href="#" className="view-channel">내 채널 보기</a>
                </div>
              </div>
              
              <hr className="user-menu-divider" />

              <ul className="user-menu-list">
                <li><span className="icon">🔗</span>Google 계정</li>
                <li><span className="icon">🔄</span>계정 전환</li>
                <li onClick={() => UserService.logout(router)}><span className="icon">🚪</span>로그아웃</li>
              </ul>
              
              <hr className="user-menu-divider" />

              <ul className="user-menu-list">
                <li><span className="icon">🎥</span>YouTube 스튜디오</li>
                <li><span className="icon">🛒</span>구매 항목 및 멤버십</li>
                <li><span className="icon">📂</span>YouTube의 내 데이터</li>
              </ul>
            </div>
          </UserPopupStyled>
        </>
      )}
    </>
  );
};

const LoginPopupStyled = styled.div`
  position: fixed;
  visibility: hidden;
  &.open {
    visibility: visible;
    z-index: 20;
    width: 100%;
    min-height: 100vh;
    max-height: 100vh;
    background-color: rgba(200, 200, 200, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  };

  .login-form {
    width: 300px;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  };
  .login-form > button {
    width: 100%;
    padding: 10px;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    &:hover {
      background: #0056b3;
    };
  };

  .login-form-field {
    display: grid;
    grid-template-columns: 100px auto;
    justify-content: center;
    align-items: center;
    gap: 20px;
    padding: 20px 0;
  };
  .login-form-field > label {
    margin-bottom: 5px;
    font-size: 14px;
    font-weight: bold;
  };
  .login-form-field > input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  };
`;


const UserTopStyled = styled.div`
  // border: 1px solid blue;
  display: flex;
  align-items: center;
  width: auto;
  
  .avatar-login {
    width: 100px;
    height: 35px;
    margin: 20px 20px;
    color: blue;
    &:hover {
      cursor: pointer;
    };
  };
  .avatar-user {
    width: 35px;
    width: 35px;
    margin: 20px 20px;
    color: blue;
    &:hover {
      cursor: pointer;
    };
  };
  .btn-session-ext > button {
    width: 43px;
    height: 22px;
    font-size: 12px;
    border: 1px solid lightgray;
    padding: 1px;
    margin-left: 8px;
    border-radius: 3px;
    cursor: pointer;
    &:hover {
      background-color: rgb(222, 222, 222);
    };
  };
`;

const UserPopupStyled = styled.div`
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

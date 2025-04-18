import React, { useState } from 'react';
import { BrowserRouter as Router , Routes , Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './login';
import Singup from './Singup';
import MainPage from './mainPage';
import MyPage from './MyPage';
import Write from './writeBorad';
import PostDetailPage from './PostDetailPage';
import EditPost from './editPostPage';

type Account = {
  ID : string;
  PASSWORD : string;
  NICKNAME: string;
}

function AppContent() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem("accounts");
    return saved ? JSON.parse(saved) : [];
  });

  const [loggedInUser, setLoggedInUser] = useState<string | null>(() => {
    return localStorage.getItem("loggedInUser")
  })

  const [nickname, setNickname] = useState<string | null>(() => {
    return localStorage.getItem("nickname")
  })

  return (
    <>
      <header style={{ height: "72px", boxShadow: "inset 0px 0px 3px #666", marginBottom: "10px" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
          <Link to="/"><img src="/Logo.png" alt="메인 페이지" style={{ height: "72px", width: "150px", display: "block" ,marginLeft:"60px"}} /></Link>
          <div style={{ display: "flex", gap: "15px" }}>
            {loggedInUser ? (
              <>
              <p onClick={() => navigate("/write")} className="nav-button" >새 글 쓰기</p>
                <p onClick={() => navigate("/mypage")} className="nav-button">내정보</p>
                <Link to = "/"><p onClick={() =>{ setLoggedInUser(null) ; localStorage.removeItem("loggedInUser"); localStorage.removeItem("nickname"); localStorage.removeItem("accounts")}} className="nav-button" style={{ fontWeight: "700"  , marginRight:"60px"}}>로그아웃</p></Link>
              </>
            ) : (
              <>
                <Link to="/login"><p className="nav-button">로그인</p></Link>
                <Link to="/signup"><p className='nav-button' style={{ fontWeight: "710" , marginRight:"60px"}}>회원가입</p></Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login accounts={accounts} setLoggedInUser={setLoggedInUser} setNickname={setNickname} />} />
        <Route path="/signup" element={<Singup accounts={accounts} setAccounts={setAccounts} />} />
        <Route path="/mypage" element={<MyPage loggedInUser = {loggedInUser} setLoggedInUser = {setLoggedInUser} setNickname = {setNickname}/>} />
        <Route path="/Write" element={<Write></Write>}></Route>
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/Editpost/:id" element ={<EditPost />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

import { useState } from "react"
import { toast,ToastContainer } from "react-toastify";
import { BrowserRouter as router , Route , Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './login.css'

import 'react-toastify/dist/ReactToastify.css';

export type Account = {
  ID: string;
  PASSWORD: string;
};


type Props = {
  accounts: Account[];
  setLoggedInUser: (userId: string) => void
  setNickname: (nickname: string) => void; 
}


function Login({accounts , setLoggedInUser , setNickname} : Props){
  const navigate = useNavigate();

  const [userId ,setUserId] = useState<string>("")
  const [userPassword , setUserPassword] = useState<string>("")
  const [showPassword , setShowPassword] = useState<boolean>(false)

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev)
  }
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try{
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          password: userPassword,
        }),
      });

      const data = await res.json()

      if(res.ok) {
        toast.success("로그인 성공!")
        setLoggedInUser(data.user_id);
        setNickname(data.nickname);
        localStorage.setItem("loggedInUser" , data.user_id);
        localStorage.setItem("nickname", data.nickname);
        navigate("/")

      }else {
        toast.error(data.message || "로그인 실패")
      }
    } catch (err) {
      console.error(err);
      toast.error("서버 오류가 발생했습니다.")
    }
  }
 


  return(
<div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
  <div style={{
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "40px",
    width: "430px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    backgroundColor: "#fff"
  }}>
    <h2 style={{ marginBottom: "20px" }}>로그인</h2>

    {/* ID 입력 */}
    <div style={{ textAlign: "left", marginBottom: "10px" }}>
      <label>ID:</label>
      <input
        type="text"
        placeholder="ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        style={{
          width: "93%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginTop: "5px"
        }}
      />
    </div>

    {/* PW 입력 */}
    <div style={{ textAlign: "left", marginBottom: "20px" }}>
      <label>Password:</label>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={userPassword}
        onChange={(e) => setUserPassword(e.target.value)}
        style={{
          width: "93%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginTop: "5px"
        }}
      />
    </div>

    {/* 로그인 버튼 */}
    <button
      onClick={handleLogin}
      className="login-button"
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "5px",
        backgroundColor: "#4caf50",
        color: "white",
        border: "none",
        marginBottom: "15px",
        cursor: "pointer",
      }}
    >
      로그인
    </button>

    {/* 회원가입 링크 */}
    <Link to="/signup" style={{ textDecoration: "none", color: "#007bff" }}>
      아이디가 없으신가요?
    </Link>
  </div>
</div>

  )}

export default Login;
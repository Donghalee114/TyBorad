import { useState } from "react"
import { toast,ToastContainer } from "react-toastify";
import { BrowserRouter as router , Route , Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
    <div>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="LoginForm" style={{border:"solid black 1px" , width: "30%", margin: "auto", marginTop : "100px" }}>
      <p>로그인</p>
      <input placeholder="ID" type="text" style={{width: "100px"}} value={userId} onChange={(e) => setUserId(e.target.value)}></input>


  <div style={{ position: "relative", display: "inline-block" }}>
    <input
    type={showPassword ? "text" : "password"}
    placeholder="비밀번호"
    value={userPassword}
    onChange={(e) => setUserPassword(e.target.value)}
    style={{ paddingRight: "20px" }}
  />
  <input
    type="checkbox"
    checked={showPassword}
    onChange={toggleShowPassword}
    style={{
      position: "absolute",
      right: "5px",
      top: "50%",
      transform: "translateY(-50%)",
    }}
  />
</div>

      <button onClick={handleLogin}>로그인</button>
      <Link to = "/signup"><p style={{color : "black"}}>아이디가 없으신가요?</p></Link>
      </div>
    </div>
  )}


export default Login;
import { BlobOptions } from "buffer";
import { useState, useTransition } from "react"
import {  useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'


export type Account = {
  ID: string;
  PASSWORD: string;
  NICKNAME : string
};

type Props = {
  accounts: Account[];
  setAccounts : React.Dispatch<React.SetStateAction<Account[]>>
}

function Singup({accounts , setAccounts} : Props) {
  
  const Navigate = useNavigate();
  const [nickname , setNickname] = useState<string>("")
  const [newId , setNewId] = useState<string>("");
  const [newPassword , setNewPassword] = useState<string>("")
  const [checkPassword , setCheckPassword] = useState<string>("")
  const [isIdReadonly, setIsIdReadonly] = useState<boolean>(false)
  const [showPassword , setShowPassword] = useState<boolean>(false)
  const [showCheckPassword , setShowCheckPassword] = useState<boolean>(false)

  //비번 보이기
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev)
  }
  //확인 비번 보이기
  const toggleCheckShowPassword = () => {
    setShowCheckPassword(prev => !prev)
  }

  const handleCheckId = async () => {

    if(newId === ""){
      toast.warning("아이디를 입력해주세요.");
      return
    }

    try{
      const res = await fetch(`http://localhost:4000/check-id?user_id=${newId}`)
      const data = await res.json();
  
    if(data.exists) {
      alert("이미 존재하는 아이디 입니다.");
      return;
    }else{
      alert("사용 가능한 아이디 입니다!")
      setIsIdReadonly(true)
    }
   
  }
  catch (err) {
    console.error(err);
    alert("서버 오류가 발생했습니다.")
  }
  }
  const resetRes = () => {
    setIsIdReadonly(false)
    setCheckPassword("")
    setNewPassword("")
    setNewId("")
    setNickname(""); 
  }

  const handleSignip = async () => {
    if(!isIdReadonly){
      alert("아이디 중복확인을 해주세요.")
      return;
    }
    else if(!newId || !newPassword || !checkPassword || !nickname)  {
      alert("모든 정보를 입력해주세요.")
      return;
    }
    if(newPassword !== checkPassword){
      alert("비밀번호가 일치하지 않습니다.")
      return;
    }
    if(!nickname) {
      alert("닉네임을 입력해주세요.")
      return;
    }
    
    try {
      
      const res = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          user_id: newId,
          password: newPassword,
          nickname,
        })
      })

      const data = await res.json();

      if (res.status === 409) {
        alert("이미 존재하는 닉네임입니다.");
      } else if (res.status === 400) {
        alert("이미 존재하는 아이디입니다.");
      }
      
      if (res.ok) {
        alert("회원가입 성공!");
        Navigate("/login")
      } else {
        alert(data.message || "회원가입 실패");
      }


    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  };

 

  return(
    <div style={{
      border: "1px solid #ccc",
      width: "430px",
      margin: "100px auto",
      padding: "40px",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      backgroundColor: "#fff"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>회원가입</h2>
    
      {/* ID 입력 */}
      <label>ID:</label>
      <div style={{ marginBottom: "15px",marginTop : "10px" , display : "flex", gap:"10px"}}>
        
        <input
          type="text"
          placeholder="ID"
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
          readOnly={isIdReadonly}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />
        <button onClick={handleCheckId} style={{ width : "130px" , padding: "10px", backgroundColor: "#f5f5f5", border: "1px solid #ccc", borderRadius: "5px",  cursor : "pointer"}}>아이디 중복 확인</button>
      </div>
    
      {/* 비밀번호 입력 */}
      <label>Password:</label>
      <div style={{ marginBottom: "15px", marginTop: "10px", position: "relative" }}>
  
        <input
          type={showPassword ? "text" : "password"}
          placeholder="비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ width: "90%", padding: "10px", paddingRight: "30px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="checkbox"
          checked={showPassword}
          onChange={toggleShowPassword}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)"
          }}
        />
      </div>
    
      {/* 비밀번호 확인 */}
      <div style={{ marginBottom: "15px",position: "relative" }}>
 
        <input
          type={showCheckPassword ? "text" : "password"}
          placeholder="비밀번호 확인"
          value={checkPassword}
          onChange={(e) => setCheckPassword(e.target.value)}
          style={{ width: "90%", padding: "10px", paddingRight: "30px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="checkbox"
          checked={showCheckPassword}
          onChange={toggleCheckShowPassword}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)"
          }}
        />
      </div>
    
      {/* 닉네임 */}
      <label>NickName:</label>
      <div style={{ marginTop : "10px",marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{ width: "95%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
      </div>
    
      {/* 버튼 */}
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
      < button onClick={handleSignip} style={{ width : "80%" ,  padding: "10px", backgroundColor: "#4caf50", color: "white", border: "none", borderRadius: "5px" , cursor : "pointer"}}>회원가입</button>
        <button onClick={resetRes} style={{ width : "50%" , padding: "10px", backgroundColor: "#f5f5f5", border: "1px solid #ccc", borderRadius: "5px",  cursor : "pointer"}}>정보 다시 입력하기</button>
      
      </div>
    </div>
    
  )
}

export default Singup
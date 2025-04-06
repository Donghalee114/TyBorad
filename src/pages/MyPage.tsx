import { METHODS } from "http";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import './mypage.css'

type Props = {
  loggedInUser: string | null;
  setNickname: (nickname: string) => void; 
};


function MyPage({loggedInUser , setNickname}: Props) {
  const [nickname, setsNickname] = useState<string | null>(() => {
    return localStorage.getItem("nickname")
  })
  
const [newNickname , setNewNickname] = useState("")  //새로운 닉네임
const [nicknamePassword , setNicknamePassword] = useState("") //닉네임 비번 확인
  
const [currentPassword, setCurrentPassword] = useState(""); //현재 비번
const [newPassword, setNewPassword] = useState(""); //새로운 비번
const [confirmPassword, setConfirmPassword] = useState(""); // 새 비번 확인

  if (!loggedInUser) {
    return <Navigate to="/login" />;
  }
    
// 닉네임 변경
const handleEditNickname = async () => {
  if(newNickname.trim() === ""){
    alert("닉네임을 입력해주세요!")
    return;}
  if(nicknamePassword.trim() === ""){
    alert("비밀번호을 입력해주세요!")
    return;}
  
  const res = await fetch("http://localhost:4000/changeNickname", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      user_id: loggedInUser,
      newNickname,
      password: nicknamePassword,
    }),
  });
  
  const data = await res.json();
  
  if(res.ok) {
    alert("닉네임 변경 완료!")
    setsNickname(newNickname)
    localStorage.setItem("nickname" , newNickname)
    setNewNickname("");
    setNicknamePassword("")
  }else{
    alert(data.message || "닉네임 변경 실패")
  }
  }


//비밀번호 변경
const handleEditPassword = async () => {
  if(!currentPassword) {
    alert("비밀번호를 입력하세요!")
    return;
  }else if(newPassword === ""){
    alert("새 비밀번호를 입력하세요!")
    return
  }

  if(newPassword !== confirmPassword) {
    alert("새 비밀번호화 확인 비밀번호가 일치하지 않습니다.")
    return
  }

  const res = await fetch("http://localhost:4000/changePassword" , {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify({
      user_id: loggedInUser,
      currentPassword,
      newPassword,
    }),
  });

  const data = await res.json();

  if(res.ok) {
    alert("비밀번호 변경 완료!")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }else{
    alert(data.message || "비밀번호 변경 실패")
  }
}


  return(
 <div className="InMypage">
  <h1>{nickname}님의 정보</h1>
  <hr/>

  <h2>내가 적은 글</h2>

  <hr/>

  <h2>닉네임 변경</h2>
  <p>새로운 닉네임</p>
  <input type ="text" value={newNickname} onChange={(e) => setNewNickname(e.target.value)}></input>
  <p>비밀번호 확인</p>
  <input type = "password" value={nicknamePassword} onChange={(e) => setNicknamePassword(e.target.value)}></input>
  <button onClick={handleEditNickname}>닉네임 변경</button>

  <hr/>
  <h2>비밀번호 변경</h2>
  <p> 현재 비밀번호</p>
  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}></input>
  <p> 새 비밀번호</p>
  <input type="password" autoComplete="current-password" value={ newPassword} onChange={(e) => setNewPassword(e.target.value)}></input>
  <p> 새 비밀번호 확인</p>
  <input type="password" autoComplete="new-password"value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></input>
  <button onClick={handleEditPassword}>비밀번호 변경</button>
    <hr/>
    
    <h2>계정 삭제</h2>
    <p style={{display : "flex" ,alignItems:"center", justifyContent:"center", width: "80px", height: "40px" ,border:"solid black 1.5px", borderRadius:"20px" , backgroundColor:"Red" , color:"white" , cursor : "pointer"}}>계정 삭제</p>
 </div>
  )
}

export default MyPage

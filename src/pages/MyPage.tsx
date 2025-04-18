import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Modal from 'react-modal';
import './mypage.css'
import { useNavigate } from "react-router-dom";

type Props = {
  loggedInUser: string | null;
  setLoggedInUser: (user : string | null) => void;
  setNickname: (nickname: string) => void; 
};

type Post = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  Created_Date : string;
}

function MyPage({loggedInUser , setLoggedInUser , setNickname}: Props) {
  const [nickname, setsNickname] = useState<string | null>(() => {
    return localStorage.getItem("nickname")
  })
  const [post , setPost] = useState<Post[]>([])
  
const [newNickname , setNewNickname] = useState("")  //새로운 닉네임
const [nicknamePassword , setNicknamePassword] = useState("") //닉네임 비번 확인
  
const [currentPassword, setCurrentPassword] = useState(""); //현재 비번
const [newPassword, setNewPassword] = useState(""); //새로운 비번
const [confirmPassword, setConfirmPassword] = useState(""); // 새 비번 확인
const [isOpen , setIsOpen] = useState<boolean>(false);// Modal 열려있는지
const navigate = useNavigate();


//페이지네이션 기능능
const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
const postsPerPage = 5; // 페이지당 최대 개수

const indexOfLast = currentPage * postsPerPage; //마지막 페이지 번호
const indexOfFirst = indexOfLast - postsPerPage; // 1 첫번쨰 페이지 번호
const currentPosts = post.slice(indexOfFirst, indexOfLast); 

// 전체 페이지 수
const totalPages = Math.ceil(post.length / postsPerPage);

useEffect(() => {
  showPost();
}, [])

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

const showPost = async () => {
  try{
    const res = await fetch("http://localhost:4000/myposts", {
      method : "POST",
      headers : {"Content-Type":"application/json"},
      body: JSON.stringify({user_id : loggedInUser})
    })

    const data = await res.json();

    if(res.ok) {
      setPost(data);
    }else{
      console.error(data.message || "내 글 불러오기 실패")
    }

  
  }catch(err) {
    console.error("서버 통신 실패" , err);
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



const handleDelAccount = async () => {
  const res = await fetch("http://localhost:4000/deleteAccount" , {
    method: "POST",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({user_id : loggedInUser})
  });

  const data = await res.json();

  if(res.ok) {
    alert("계정이 삭제되었습니다.")
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("nickname");

    setLoggedInUser(null);
    setNickname("");
    
    navigate('/')
  }else {
    alert(data.message || "계정 삭제 실패")
  }
}



  return(

 <div className="InMypage">
  <h1>{nickname}님의 정보</h1>
  <hr/>

  <h2>내가 적은 글</h2>
  <div>
    {post.length === 0 ? (
      <p style={{ padding: "10px", color: "#888" }}>작성한 글이 없습니다.</p>
    ) : (
      currentPosts.map((p) => (
        <div 
        className="nav-bar"
        key={p.id}
        style={{

        }} 
        onClick={() => navigate(`/posts/${p.id}`) }
        >
          <div style={{display: "flex", justifyContent : "space-between"}}>  
            <strong>{p.title}</strong>
          <div>
          <strong>작성일 :</strong> {p.Created_Date}
          </div>
          </div>

       
        </div>
      ))
    )}

    {post.length > postsPerPage && (
      <div style={{ marginTop : "20px" , display : "flex" , gap : "10px"}}> 
      <button disabled={currentPage === 1} 
      onClick={() => setCurrentPage((prev) => prev - 1)}
        >이전</button><span>{currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}> 다음
        </button>
      </div>
    )}
  </div>

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
    <p style={{display : "flex" ,alignItems:"center", justifyContent:"center", width: "80px", height: "40px" ,border:"solid black 1.5px", borderRadius:"20px" , backgroundColor:"Red" , color:"white" , cursor : "pointer"}} onClick={() => setIsOpen(true)}>계정 삭제</p>
    <Modal 
    isOpen={isOpen}
     onRequestClose={() => setIsOpen(false)}
     style={{
      content : {
        width : "300px",
        height : "250px",
        margin : "auto",
        textAlign : "center"
      }
     }}
     >
      <h2>정말 삭제하시겠어요?</h2>
      <div style={{display: "flex" , justifyContent : "space-around", marginTop : "50px"}}>
      <button onClick={handleDelAccount} style={{color : "white" , backgroundColor : "red", width : "80px", height : "40px" ,borderRadius : "20px" , cursor : "pointer"}}>삭제</button>
      <button onClick={() => setIsOpen(false)}  style = {{width : "80px", height : "40px" , borderRadius : "20px", cursor : "pointer"}}>취소</button>
</div>
 
    </Modal>
 </div>

  )
}

export default MyPage

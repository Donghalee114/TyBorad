import { METHODS } from "http";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // 추가


type Post = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  Created_Date : string;
  view_count : string;
};

function PostDetailPage(){
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem('loggedInUser')
  const {id} = useParams();
  const [post , setPost] = useState<Post | null>(null);
  

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`http://localhost:4000/posts/${id}`);
        if (!res.ok) throw new Error("게시글을 불러오지 못했습니다.");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error(err);
      }
    };

    getPost();
  }, [id]);


  const DeletePost = async () => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;
  
    try {
      const res = await fetch(`http://localhost:4000/posts/${id}`, {
        method: "DELETE",
      });
  
      if (res.ok) {
        alert("삭제 완료!");
        navigate("/"); // 홈으로 이동
      } else {
        const data = await res.json();
        alert(data.message || "삭제 실패");
      }
    } catch (err) {
      alert("서버 오류 발생");
      console.error(err);
    }

  }
 

  if(!post) return <div>로딩 중...</div>
return(
  <div style={{ width: "70%", margin: "50px auto" }}>
 <h1>{post.title}</h1>
    <div style={{gap : "30px" , alignItems : "center"}}>
   

<div style={{display : "flex"}}>
{
post.user_id === loggedInUser

?<div style={{display : "flex", justifyContent : "space-evenly"  }}>
  <p style={{marginRight : "200px" , width : "380px" , justifyItems :"center"}}><strong>작성자:</strong> {post.user_id} <strong style={{marginLeft:"7px"}}>작성일:</strong> {post.Created_Date}</p>
  <div style={{marginLeft : "400px" ,display : "flex" , justifyItems : "center" , alignItems : "center" , gap : "20px", width : "250px"}}>  <p style = {{cursor : "pointer"}}onClick={() => navigate(`/Editpost/${post.id}`)}>글 수정</p> <p style={{cursor : "pointer"}} onClick={DeletePost}>글 삭제</p> </div>
  </div> 
: <p style={{marginRight : "200px" , width : "380px" , justifyItems :"center"}}><strong>작성자:</strong> {post.user_id} <strong style={{marginLeft:"7px"}}>작성일:</strong> {post.Created_Date}</p>
}
   </div> 
  </div>
    <div style={{borderTop : "1px solid #ccc" , marginTop:"10px" , paddingTop: "10px"}}>
      <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>{post.content}</p>
    </div>
  </div>
)}

export default PostDetailPage;
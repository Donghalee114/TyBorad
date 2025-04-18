import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './mainpage.css'


type Post = {
  id: string;
  user_id: string;
  title: string;
  content: string;
}
function MainPage() {
  const [posts , setPost] = useState<Post[]>([])
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/posts")
    .then((res) => res.json())
    .then((data) => {
      setPost(data);
    })
    .catch((err) => {
      console.error("게시글 불러오기 실패")
    })
  }, [])

  const handleDelBoard = () => {
    
  }

  return(
   
   <div>
    <h1 style={{marginLeft:"100px"}}>게시판</h1>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "40px",
    width: "80%",
    margin: "0 auto"
  }}
>
  {posts.map((post) => (
    <div
    className="border-bar"
      key={post.id}
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      <div>
      <h4 style={{ padding : "10px", marginTop : "5px"}}>{post.title}</h4>
      <p
  style={{
    padding: "10px",
    fontSize: "15px",
    color: "#808080",
    display: "-webkit-box",
    overflow: "hidden",
    WebkitLineClamp: 2, // ← 원하는 줄 수
    WebkitBoxOrient: "vertical",
    lineHeight: "1.4",
    height: "2.5em", // lineHeight * 줄 수
    width : "230px"
  }}
>
  {post.content}
</p>
      </div>
   
    </div>
  ))}
</div>

   </div>


    
  )
}

export default MainPage;
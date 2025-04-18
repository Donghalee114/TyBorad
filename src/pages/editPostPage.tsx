import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [newTitle, setNewTitle] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");

  // 기존 글 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:4000/posts/${id}`);
        if (!res.ok) throw new Error("불러오기 실패");
        const data = await res.json();
        setNewTitle(data.title);
        setNewContent(data.content);
      } catch (err) {
        console.error("게시글 가져오기 에러", err);
      }
    };

    fetchPost();
  }, [id]);

  // 수정 요청
  const handleEditPost = async () => {
    const res = await fetch(`http://localhost:4000/Editpost/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: newTitle, content: newContent })
    });

    const data = await res.json();

    if (res.ok) {
      alert("수정 완료!");
      navigate(`/posts/${id}`); // 상세 페이지로 이동
    } else {
      alert(data.message || "수정 실패");
    }
  };

  return (
    <div style={{ width: "60%", margin: "50px auto" }}>
      <h2>글 수정</h2>
      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <textarea
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
        style={{ width: "100%", height: "200px", padding: "10px" }}
      />
      <button onClick={handleEditPost} style={{ marginTop: "15px" }}>
        수정 완료
      </button>
    </div>
  );
}

export default EditPost;

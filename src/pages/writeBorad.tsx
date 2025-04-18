import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Write() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const Dates = new Date().toISOString().slice(0, 10);
  const navigate = useNavigate();

  // 로그인된 유저 아이디 가져오기
  const user_id = localStorage.getItem("loggedInUser");

  const handleSubmit = async () => {
    if (!user_id) {
      alert("로그인 후 작성할 수 있습니다.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력하세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, title, content , Dates})
      });

      const data = await res.json();

      if (res.ok) {
        alert("작성 완료!");
        navigate("/"); // 메인으로 이동
      } else {
        alert(data.message || "작성 실패");
      }
    } catch (err) {
      alert("서버 오류 발생");
      console.error(err);
    }
  };

  return (
    <div style={{ width: "60%", margin: "50px auto" }}>
      <h2>글 작성</h2>
      <input
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <textarea
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "100%", height: "200px", padding: "10px" }}
      />
      <button onClick={handleSubmit} style={{ marginTop: "15px" }}>
        작성 완료
      </button>
    </div>
  );
}

export default Write;

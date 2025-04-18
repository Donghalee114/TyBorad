const express = require("express");
const router = express.Router();
const db = require("../ll/db");

router.post("/posts", (req , res) => {
  const {user_id , title , content , Dates , view_count} = req.body;
  const id = `${user_id}_${title}_${Date.now()}`
  const query = `INSERT INTO posts (id , user_id , title , content , Created_Date , view_count) VALUES (?,?,?,?,?,?)`

  db.run(query, [id,user_id,title,content ,Dates , view_count] , function(err) {
    if (err) return res.status(500).json({message: "DB 저장 실패"});
    res.status(201).json({message: "글 작성 완료" , postId: id}) 
  });
});


router.get("/posts", (req, res) => {
  db.all("SELECT * FROM posts ORDER BY rowid DESC" , [], (err ,rows) => {
    if(err) return res.status(500).json({message : "DB 조회 실패"})
      res.json(rows);
  });
});

router.get("/posts/:id" , (req , res) => {

  const {id} = req.params;

  db.run("UPDATE posts SET view_count = view_count + 1 WHERE id = ?", [id], (updateErr) => {
    if (updateErr) return res.status(500).json({message : "조회수 업데이트 실패"})

  db.get("SELECT * FROM posts WHERE id = ?" , [id] , (err ,row) => {
    if(err) return res.status(500).json({message : "DB 에러"});
    if(!row) return res.status(404).json({message: "게시글 없음"})
    res.json(row);
  });
  });
});


router.put("/Editpost/:id" , (req , res) => {
  const {id} = req.params;
  const {content , title} = req.body
  
  if(!content) {
    return res.status(400).json({message : "내용이 비어 있습니다."})
  }
  const query = "UPDATE posts SET title = ? ,content = ? WHERE id = ?" 

  db.run(query , [title ,content , id], (err) =>{
    if(err) {return res.status(500).json({message : "게시글 업데이트 실패"})}
    
    return res.status(200).json({message : "게시글 수정 완료"})
  })
})


router.delete("/posts/:id" , (req , res) => {
  const {id} = req.params;

  const query = "DELETE FROM posts WHERE id = ?"

  db.run(query , [id] , (err) => {
    if(err) {return res.status(500).json({message : "게시글 삭제 실패"})}

    return res.status(200).json({message : "게시글 삭제 완료"})
  })
})

router.post("/myposts" , (req , res) => {
  const {user_id} = req.body;

  db.all("SELECT * FROM posts WHERE user_id =? ORDER BY rowid DESC" , [user_id] , (err , rows) => {
    if (err) return res.status(500).json({ message : "DB 에러"})
    res.json(rows);
  })
})
module.exports = router;
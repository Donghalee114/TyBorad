const express = require("express")
const router = express.Router();
const db = require("../ll/db")
const bcrypt = require("bcrypt");

router.post("/login" , (req , res) => {
  const {user_id , password} = req.body;

  if (!user_id || !password) {
    return res.status(400).json({message : "아이디와 비밀번호를 입력해주세요."})
  }
  
  const query = `SELECT * FROM users WHERE user_id = ?`
  db.get(query , [user_id] , async (err , row) => {
    if (err){
      console.error(err);
      return res.status(500).json({message : "서버 에러입니다."})
    }
    if(!row){
      return res.status(401).json({message : "존재하지 않는 아이디입니다."})
    }

    const match = await bcrypt.compare(password , row.password);
    if(!match) {
      return res.status(401).json({message : "비밀번호가 일치하지 않습니다."})
    }
    return res.status(200).json({message: "로그인 성공!",
      user_id: row.user_id,
      nickname : row.nickname})
  })
})

module.exports = router;
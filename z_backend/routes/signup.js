const express = require("express");
const router = express.Router();
const db = require("../ll/db");
const bcrypt = require('bcrypt');


router.get("/check-id", (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ message: "user_id를 입력하세요." });
  }

  const query = `SELECT * FROM users WHERE user_id = ?`;
  db.get(query, [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "서버 에러" });
    }

    return res.json({ exists: !!row });
  });
});


router.post("/signup", async (req, res) => {
  const { user_id, password, nickname } = req.body;

  if (!user_id || !password || !nickname) {
    return res.status(400).json({ message: "아이디와 비밀번호, 닉네임을 모두 입력해주세요." });
  }

  try {
    // ✅ 닉네임 중복 체크
    const nicknameQuery = `SELECT * FROM users WHERE nickname = ?`;
    db.get(nicknameQuery, [nickname], async (err, existingNickname) => {
      if (err) {
        console.error("닉네임 중복 체크 오류", err);
        return res.status(500).json({ message: "서버 에러" });
      }

      if (existingNickname) {
        return res.status(400).json({ message: "이미 존재하는 닉네임입니다." });
      }

      // ✅ 닉네임 통과했으면, 비밀번호 해시 후 DB에 저장
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = `
        INSERT INTO users (user_id, password, nickname) VALUES (?, ?, ?)
      `;
      db.run(query, [user_id, hashedPassword, nickname], function (err) {
        if (err) {
          return res.status(400).json({ message: "이미 존재하는 아이디입니다.", userId: user_id });
        }

        return res.status(201).json({ message: "회원가입 성공!", userID: user_id });
      });
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 에러입니다." });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../ll/db");
const bcrypt = require("bcrypt")

router.post("/changeNickname", (req, res) => {
  const { user_id, newNickname, password } = req.body;

  if (!user_id || !newNickname || !password) {
    return res.status(400).json({ message: "정보가 부족합니다." });
  }

  // 사용자 정보 가져오기
  db.get("SELECT * FROM users WHERE user_id = ?", [user_id], async (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "서버 에러" });
    }

    if (!row) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const match = await bcrypt.compare(password, row.password);
    if (!match) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    // 닉네임 중복 확인
    db.get("SELECT * FROM users WHERE nickname = ?", [newNickname], (err, existing) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "서버 에러" });
      }

      if (existing) {
        return res.status(409).json({ message: "이미 사용 중인 닉네임입니다." });
      }

      // 닉네임 변경
      db.run("UPDATE users SET nickname = ? WHERE user_id = ?", [newNickname, user_id], function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "닉네임 변경 실패" });
        }

        return res.status(200).json({ message: "닉네임이 변경되었습니다." });
      });
    });
  });
});

module.exports = router;
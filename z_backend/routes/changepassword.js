const express = require("express")
const router = express.Router();
const db = require("../ll/db")
const bcrypt = require('bcrypt');

router.post('/changePassword', async (req ,res)  => {
  const { user_id , currentPassword , newPassword} = req.body

  try {

    const query = `SELECT * FROM users where user_id = ?`
    db.get(query, [user_id] , async (err , row) => {
      if (err) {
        console.error("데이터베이스 쿼리 오류" , err)
        return res.status(500).json({message: "데이터베이스 오류"})
      }
      if(!row) {
        return res.status(404).json({ message : "사용자를 찾을 수 없습니다."})
      }

      const passwordMatch = await bcrypt.compare(currentPassword , row.password);

      if(!passwordMatch) {
        return res.status(401).json({message : "현재 비밀번호가 일치하지 않습니다"})
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10)

      const updateQuery = `UPDATE users SET password = ? WHERE user_id = ?`;
      db.run(updateQuery, [hashedNewPassword , user_id] , function (err) {
        if(err) {
          console.error("비밀번호 업데이트 오류" , err);
          return res.status(500).json({ message: "비밀번호 업데이트 실패" })
        }
        return res.status(200).json({ message: "비밀번호가 성공적으로 변경되었습니다" });
      })
    });
} catch (error) {
  console.error(error)
  return res.status(500).json({message : "서버 에러"})
}
});

module.exports = router;
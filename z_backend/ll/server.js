const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const singUpRoutes = require("../routes/signup")
const loginRouter = require("../routes/login")
const changePasswordRouter = require('../routes/changepassword')
const changeNickname = require('../routes/changeNickname')

const app = express()
app.use(express.json());


app.use(cors())
app.use(bodyParser.json())
app.use(singUpRoutes)
app.use(loginRouter)
app.use(changePasswordRouter)
app.use(changeNickname)

app.listen(4000 , () => {
  console.log("서버 실행 중 : http://localhost:4000")
})
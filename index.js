const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');
//const todo = require('./src/models/todo');
const user = require('./src/models/User');

const corsOptions = {
  origin : 'http://127.0.0.1:5500', // 해당 URL 주소만 요청 허용
  credentials : true // 사용자 인증이 필요한 리소스를 요청할수 있도록 허용
};
const CONNECT_URL = 'mongodb://127.0.0.1:27017/JeeGAe';
mongoose.connect(CONNECT_URL)
.then(() => console.log('mongodb connect'))
.catch(e => console.log(`failed to connect mongodb: ${e}`));

app.use(cors(corsOptions)); // CORS 설정
app.use(express.json()); // request body 파싱
app.use(logger('tiny')) // logger 설정

app.get('/hello', (req, res) => {
  res.json('hello world');
})

app.post('/hello', (req, res) => {
  console.log(req.body);
  res.json({ userId : req.body.userId, email : req.body.email})
})

app.get('/fetch', async (req, res) => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
  res.send(response.data);
})

app.get('/error', (req, res) => {
  throw new Error('서버에 치명적인 에러 발생!!')
})

// 폴백 핸들러 (fallback handler)
app.use((req, res, next) => { // 사용자가 요청한 페이지가 없는 경우
  res.status(404).send("Page not found 404")
})

// 서버내부 오류처리
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
})

app.listen(5000, () => {
  console.log('server is running on port 5000...');
})
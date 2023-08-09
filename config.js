const dotenv = require('dotenv');

// procss.env 객체에 .env 파일 에서 설정해둔 환경 변수 주입
dotenv.config();

module.exports = {
  MONGODB_URL : process.env.MONGODB_URL,
  JWT_SECRET : process.env.JWT_SECRET
}
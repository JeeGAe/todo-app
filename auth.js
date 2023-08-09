const config = require('./config');
const jwt = require('jsonwebtoken');

const generateToken = (user) => { // 토큰 생성
  return jwt.sign({
    _id : user.id, // 사용자 정보 (json 문자열)
     name : user.name,
     email : user.email,
     userId : user.userId,
     isAdmin : user.isAdmin,
     createdAt : user.createdAt
  },
  config.JWT_SECRET,
  {
    expiresIn : '1d',  // 만료기한 (1d : 하루)
    issuer : 'JeeGAe'
  })
}

const isAuth = (req, res, next) => {  // 권한을 확인 하는 라우트 핸들러 함수
  const bearToken = req.headers.authorization // 요청헤더의 Authorization 조회
  if(!bearToken){
    res.status(401).json({ message : 'Token is not supplied'})
  }else{
    const token = bearToken.slice(7, bearToken.length); // 베어러를 제외한 실제 토큰
    jwt.verify(token, config.JWT_SECRET, (err, userInfo) => {
      if(err && err.name === 'TokenExpiredError'){
        res.status(419).json({ code : 419, message : 'token expired'})
      }else if(err){
        res.status(401).json({ code: 401, message : 'Invalid Token!'})
      }
      req.user = userInfo; // 브라우저에서 전송한 사용자 정보(jwt 토큰을 복호화한것)을 req 객체에 저장
      next();
    })
  }
}

const isAdmin = (req, res, next) => { // 관리자 확인
  if(req.user && req.user.isAdmin){
    next(); // 다음 서비스를 사용할 수 있도록 허용
  }else {
    res.status(401).json({ code : 401, message : 'You are not Admin'});
  }
}

module.exports = {
  generateToken,
  isAuth,
  isAdmin,
}
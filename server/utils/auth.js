const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    SECRET_KEY,
    { expiresIn: '24h' }
  );
};

module.exports = {
  signToken,
};

const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];
    
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        req.user = user;
      } catch(err) {
        console.error("Token verification failed:", err.message);
      }
    }
  }
  
  next();
};
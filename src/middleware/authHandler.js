import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

export default function authenticateJWT(req, res, next) {
  const token = req.headers.authorization;
  if (!token) 
    return res.redirect('/login');
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.redirect('/login');
    }
    req.user = user;
    next();
  });
}
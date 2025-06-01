import { auth } from "express-oauth2-jwt-bearer";
import { jwtConfig } from "../config/authConfig.js";

const authHandler = () => {
  return (req, res, next) => {
    if (!req.oidc.isAuthenticated()) {
      return res.status(401).json({ message: "User is Unauthorized" });
    }
    // Add user info to request
    req.user = {
      nickname: req.oidc.user.nickname,
      sub: req.oidc.user.sub,
      email: req.oidc.user.email,
    };

    // Add CSRF protection
    res.set("X-CSRF-Token", req.oidc.accessToken);
    next();
  };
};

const jwtCheck = auth(jwtConfig);

export { authHandler, jwtCheck };

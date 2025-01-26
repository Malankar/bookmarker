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

export { authHandler };

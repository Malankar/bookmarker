const authHandler = () => {
  return (req, res, next) => {
    if (!req.oidc.isAuthenticated()) {
      return res.status(401).json({ message: "User is Unauthorized" });
    }
    next();
  };
};

export { authHandler };

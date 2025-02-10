export const login = (req, res) => {
  if (req.oidc.isAuthenticated()) {
    return res.redirect("/profile");
  }
  res.oidc.login({ returnTo: "/profile" });
};

export const authCallback = (req, res) => {
  try {
    res.redirect("/profile");
  } catch (error) {
    console.error("Auth callback error:", error);
    res.redirect("/login");
  }
};

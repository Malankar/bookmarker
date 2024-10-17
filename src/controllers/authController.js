import authService from "../services/authService.js";

const register = async (req, res, next) => {
  try {
    await authService.register();
    res.status(201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const data = await authService.login(username, password);
    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

const authController = {
  register,
  login,
};

export default authController;

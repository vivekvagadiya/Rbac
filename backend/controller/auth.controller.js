const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body.email, req.body.password);
    res.status(201).json(user);
  } catch (error) {
    next(err);
  }
};

module.exports = { register, login };

const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    console.log('req.body',req.body);
    
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body.email, req.body.password);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { register, login };

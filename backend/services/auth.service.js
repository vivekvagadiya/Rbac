const User = require("../models/user.model");

const registerUser = async (data) => {
  console.log(data);
  const userExist = await User.findOne({ email: data.email });
  console.log('userExist',userExist);
  
  if (userExist) {
    throw new Error("User already exists");
  }

  const user = await User.create(data);
  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid Credentials");
  }
  if (user.password !== password) {
    throw new Error("Invalid Credentials");
  }

  return user;
};
module.exports = { registerUser, loginUser };

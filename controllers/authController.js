const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};



const registerUser = async (req, res) => {
  const { name,email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      error: 'User already exists'
  });
  }

  const user = await User.create({ name,email, password });
  

  if (user) {
    res.status(201).json({
      _id: user._id,
      name:user.name,
      email: user.email,
      token: generateToken(user._id),
      code: 200,
    });
  } else {
     res.status(400).json({
      error: 'Invalid user data'
  });
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
      message:"user login successfully",
      code: 200,
    });
  } else {
    res.json({
      message:"Invalid email or password",
      code: 401,
    });
    // res.status(401);
    // throw new Error('Invalid email or password');
  }
};

module.exports = { registerUser, authUser };

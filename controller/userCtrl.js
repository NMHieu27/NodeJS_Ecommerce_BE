const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshtoken");
const validateMongoDbId = require("../utils/validateMongodbId");
const jwt = require("jsonwebtoken");
// Create a User ----------------------------------------------

const createUser = asyncHandler (async (req, res) => {
  /**
   * TODO:Get the email from req.body
   */
  const email = req.body.email;
  /**
   * TODO:With the help of email find the user exists or not
   */
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    // if user not found user create a new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    // if user found then thow an error: User already exists
    throw new Error("User Already Exists");
  }
});

// Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// logout functionality

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate({refreshToken}, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});
//Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    throw new Error(error);
  }
});
//Get a single user
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //Kiểm tra id đó có valid trong mongodb không
  validateMongoDbId(id);
  try {
    const user = await User.findById(id);
    res.json({
      user,
    });
  } catch (error) {
    throw new Error(error);
  }
});
//Delete a single user
const deleteUserById = asyncHandler(async (req, res) =>{
  const { id } = req.params;
  //Kiểm tra id đó có valid trong mongodb không
  validateMongoDbId(id);
  try {
    const userDeleted = await User.findByIdAndDelete(id);
    res.json({
      userDeleted,
    });
  } catch (error) {
    throw new Error(error);
  }
});
//Update a single user
const updatedUser = asyncHandler(async (req, res) => {
  //lấy thông tin _id từ user đã đăng nhập, authMiddleware đã xữ lí điểu này
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});
//Block a single user
const blockedUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try{
    const userBlocked = await User.findByIdAndUpdate(id,{
    isBlocked: true,
  },{
    new: true,
  })
  res.json({
    message: 'User blocked',
  });
  }
  catch (error) {
    throw new Error('Cannot block user, ERR: ', error);
  }
});
//Unblock a single user
const unblockedUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try{
    const userUnblocked = await User.findByIdAndUpdate(id,{
    isBlocked: false,
  },{
    new: true,
  })
  res.json({
    message: 'User Unblock',
  });
  }
  catch (error) {
    throw new Error('Cannot unblock user, ERR: ', error);
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  getAllUsers,
  getUserById,
  deleteUserById,
  updatedUser,
  blockedUser,
  unblockedUser,
  handleRefreshToken,
  logout,
};

const AppError = require('../utils/appError');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

const filterObj = (obj, ...allowedFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) filteredObj[el] = obj[el];
  });
  return filteredObj;
};

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: { users },
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  // 1 Create error if user  post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update, please user /updatePassword',
        400,
      ),
    );
  }

  // 2 Update user document
  // It not gonna work for save passwordConfirm is not provided
  // const user = await User.findById(req.user.id);
  // user.name = 'Jonas';
  // await user.save();

  //we dont't paste all body object
  // the user can't update role for example
  // Need to filter for body user
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3 update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route not defined! Please use /signup instead',
  });
};

const getUser = factory.getOne(User);

const updateUser = factory.updateOne(User);

const deleteMe = catchAsync(async (req, res, next) => {
  //Deactive user
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const deleteUser = factory.deleteOne(User);

const userController = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
};

module.exports = userController;

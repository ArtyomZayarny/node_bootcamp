const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // user-67676bsdad-33444.jpeg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadUserPhoto = upload.single('photo');
const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

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
  if (req.file) filteredBody.photo = req.file.filename;

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

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const deleteUser = factory.deleteOne(User);

const userController = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  getMe,
  deleteMe,
  uploadUserPhoto,
  resizeUserPhoto,
};

module.exports = userController;

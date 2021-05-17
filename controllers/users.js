const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { errorOutput } = require('../utils/utils');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res
      .status(200)
      .send({ data: users }))
    .catch((err) => errorOutput(err, res))
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new Error('Такого пользователя не существует'))
    .then((user) => res
      .status(200)
      .send({ data: user }))
    .catch((err) => errorOutput(err, res))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params._id)
    .orFail(() => new Error('Такого пользователя не существует'))
    .then((user) => res
      .status(200)
      .send({ data: user }))
    .catch((err) => errorOutput(err, res))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res
      .status(200)
      .send({ data: { _id: user._id, email: user.email } }))
    .catch((err) => errorOutput(err, res))
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new Error('invalidUserId'))
    .then((user) => res
      .status(200)
      .send({ data: user }))
    .catch((err) => errorOutput(err, res))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new Error('invalidUserId'))
    .then((user) => res
      .status(200)
      .send({ data: user }))
    .catch((err) => errorOutput(err, res))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-secret', { expiresIn: '7d' });
      const data = {
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      };
      res
        .status(200)
        .send({ data, token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

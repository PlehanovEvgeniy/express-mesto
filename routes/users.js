const users = require('express').Router();
const {
  getUsers, getUser, createUser, updateAvatar, updateUserInfo, getUserInfo,
} = require('../controllers/users');

users.get('/', getUsers);
users.post('/', createUser);
users.get('/:_id', getUser);
users.get('/me', getUserInfo);
users.patch('/me', updateUserInfo);
users.patch('/me/avatar', updateAvatar);

module.exports = users;

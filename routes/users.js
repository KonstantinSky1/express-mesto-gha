const router = require('express').Router();

const {
  getUsers, getUser, updateUser, updateAvatar, getUserMe,
} = require('../controllers/users');

router.get('/users/me', getUserMe);
router.get('/users', getUsers);
router.get('/users/:userId', getUser);
//router.post('/users', createUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;

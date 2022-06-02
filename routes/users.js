const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUser, updateUser, updateAvatar, getUserMe,
} = require('../controllers/users');

router.get('/users/me', getUserMe);
router.get('/users', getUsers);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24),
  }),
}), getUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), updateUser);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/(?:(http|https):\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+/),
  }).unknown(true),
}), updateAvatar);

module.exports = router;

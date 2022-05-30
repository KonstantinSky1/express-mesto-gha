const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request');
const UnauthorizedError = require('../errors/unauthorized');
const ConflictError = require('../errors/conflict');

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        // return res.status(401).send({ message: 'Неверные почта или пароль' });
        return next(new UnauthorizedError('Неверные почта или пароль'));
      }
      // return res.status(500).send({ message: 'На сервере произошла ошибка' });
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Данный емеил уже занят'));
      }
      if (err.name === 'ValidationError') {
        // return res.status(400).send({ message: 'Некорректные данные name или link или avatar' });
        return next(new BadRequestError('Некорректные данные name или link или avatar'));
      }

      // return res.status(500).send({ message: 'На сервере произошла ошибка' });
      next(err);
    });
};

const getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    // .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
    .catch((err) => next(err));
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        // return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // return res.status(400).send({ message: 'id некорректен' });
        return next(new BadRequestError('id некорректен')) ;
      }

      // return res.status(500).send({ message: 'На сервере произошла ошибка' });
      next(err);
    });
};

const getUserMe = (req, res, next) => { //
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        // return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      // return res.status(500).send({ message: 'На сервере произошла ошибка' });
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // return res.status(400).send({ message: 'Некорректные данные name или about' });
        return next(new BadRequestError('Некорректные данные name или about'));
      }
      // return res.status(500).send({ message: 'На сервере произошла ошибка' });
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // return res.status(400).send({ message: 'Некорректные данные avatar' });
        return next(new BadRequestError('Некорректные данные avatar'));
      }
      // return res.status(500).send({ message: 'На сервере произошла ошибка' });
      next(err);
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  login,
  getUserMe,
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        return res.status(401).send({ message: 'Неверные почта или пароль' });
      }

      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некорректные данные name или link или avatar' });
      }

      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUsers = (_, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'id некорректен' });
      }

      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUserMe = (req, res) => { //
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {                                                 //      как проверить??? Может оно здесь не надо?
        return res.status(400).send({ message: 'id некорректен' });
      }

      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUser = (req, res) => {
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
        return res.status(400).send({ message: 'Некорректные данные name или about' });
      }

      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
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
        return res.status(400).send({ message: 'Некорректные данные avatar' });
      }

      return res.status(500).send({ message: 'На сервере произошла ошибка' });
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

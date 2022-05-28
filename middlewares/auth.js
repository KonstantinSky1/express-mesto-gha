const jwt = require('jsonwebtoken');

const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};


// При успешной авторизации в объекте запроса появится свойство user, в которое запишется пейлоуд токена. Его можно использовать в обработчиках:
//  controllers/cards.js

// module.exports.createCard = (req, res) => Card.create({
//   name: req.body.name,
//   link: req.body.link,
//   owner: req.user._id // используем req.user
// });
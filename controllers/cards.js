const Card = require('../models/card');

const getCards = (_, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некорректные данные name или link' });
      }

      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      switch (true) {
        case !card :
          return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
        case req.user._id !== JSON.stringify(card.owner).slice(1, -1) :
          return res.send({ message: 'Невозможно удалить чужую карточку' });
        default :
          return card.remove().then(() => res.send({ data: card }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'id карточки некорректен' });
      }

      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'в БД нет карточки с таким id' });
      }

      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'некорректен id карточки' });
      }

      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'в БД нет карточки с таким id' });
      }

      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'некорректен id карточки' });
      }

      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};

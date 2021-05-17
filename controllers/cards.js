const Card = require('../models/card');
const { errorOutput } = require('../utils/utils');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res
      .status(200)
      .send({ data: cards }))
    .catch((err) => errorOutput(err, res))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res
      .status(200)
      .send({ data: card }))
    .catch((err) => errorOutput(err, res))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error('invalidCardId'))
    .then((card) => {
      if (card.owner._id !== req.user._id) {
        return res
          .status(403)
          .send({ message: 'Нет доступа' });
      }

      return res
        .status(200)
        .send({ data: card });
    })
    .catch((err) => errorOutput(err, res))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(() => new Error('invalidCardId'))
    .then((card) => res
      .status(200)
      .send({ data: card }))
    .catch((err) => errorOutput(err, res))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(() => new Error('invalidCardId'))
    .then((card) => res
      .status(200)
      .send({ data: card }))
    .catch((err) => errorOutput(err, res))
    .catch(next);
};

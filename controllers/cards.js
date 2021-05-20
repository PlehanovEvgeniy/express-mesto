const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((data) => res.status(200).send({ data }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((data) => res.status(200).send({ data }))
    .catch(() => {
      throw new BadRequestError('Переданы неверные данные при создании карточки');
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new Error('invalidUserId');
    })
    .then((data) => {
      if (data.owner._id !== req.user._id) {
        throw new ForbiddenError('Чужие карточки нельзя удалять');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((newCard) => res.status(200).send({ data: newCard }))
        .catch(next);
    })
    .catch((err) => {
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(() => {
      throw new Error('invalidUserId');
    })
    .then((data) => res.status(200).send({ data }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError(err.message);
      }
      throw new BadRequestError('Переданы неверные данные при лайке карточки');
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(() => {
      throw new Error('invalidUserId');
    })
    .then((data) => res
      .status(200)
      .send({ data }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError(err.message);
      }
      throw new BadRequestError('Переданы неверные данные при дизлайке карточки');
    })
    .catch(next);
};

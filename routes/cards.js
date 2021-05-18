const cards = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  cardValidation,
  idValidation,
} = require('../middlewares/validation');

cards.get('/', getCards);
cards.post('/', cardValidation, createCard);
cards.delete('/:cardId', idValidation, deleteCard);
cards.put('/:cardId/likes', idValidation, likeCard);
cards.delete('/:cardId/likes', idValidation, dislikeCard);

module.exports = cards;

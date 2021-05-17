const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ServerError = require('../errors/server-err');

function errorOutput(err, res) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    throw new BadRequestError(err.message);
  }
  if (err.message === 'invalidUserId' || err.message === 'invalidCardId') {
    throw new NotFoundError(err.message);
  }

  throw new ServerError(err.message);
}

module.exports = { errorOutput };

const service = require("./movies.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const { is_showing } = req.query;
  if (is_showing && is_showing === "true") {
    const data = await service.isShowing();
    res.status(200).json({ data });
  }

  const data = await service.list();
  res.status(200).json({ data });
}

async function read(req, res, next) {
  res.json({ data: res.locals.movie });
}

async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found." });
}

async function readTheatersPlayingMovie(req, res) {
  const { movie } = res.locals;
  const data = await service.readTheatersPlayingMovie(movie.movie_id);
  res.json({ data });
}

async function readReviewsForMovie(req, res) {
  const { movie } = res.locals;
  const data = await service.readReviewsForMovie(movie.movie_id);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  readTheatersPlayingMovie: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readTheatersPlayingMovie),
  ],
  readReviewsForMovie: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readReviewsForMovie),
  ],
};

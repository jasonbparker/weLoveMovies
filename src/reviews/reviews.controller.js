const service = require("./reviews.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
//const hasProperties = require("../errors/hasProperties")

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function read(req, res) {
  const { review } = res.locals;
  const data = await service.read(review.review_id);
  res.json({ data });
}

async function update(req, res, next) {
  const { review } = res.locals;
  const updatedReview = {
    ...req.body.data,
    review_id: review.review_id,
    critic_id: review.critic_id,
    movie_id: review.movie_id,
  };
  let data = await service.update(updatedReview);
  data = await service.readReviewWithCritic(review.review_id);
  res.json({ data: data[0] });
}

async function destroy(req, res, next) {
  const { review } = res.locals;
  await service.delete(review.review_id);
  res.sendStatus(204);
}

//validation
async function reviewExists(req, res, next) {
  const review = await service.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: "Review cannot be found." });
}

function hasValidScore(req, res, next) {
  const {
    data: { score },
  } = req.body;

  if (score < 1 || score > 5) {
    return next({
      status: 400,
      message: "Score must have a value between 1 and 5",
    });
  } else {
    next();
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reviewExists),
    hasValidScore,
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};

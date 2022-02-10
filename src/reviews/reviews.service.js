const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritics = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

function list() {
  return knex("review").select("*");
}

function read(review_id) {
  return knex("reviews").select("*").where({ review_id }).first();
}

function readReviewWithCritic(review_id) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .where({ "r.review_id": review_id })
    .select("*")
    .then((reviews) => reviews.map(addCritics));
}

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
}

module.exports = {
  list,
  read,
  readReviewWithCritic,
  update,
  delete: destroy,
};

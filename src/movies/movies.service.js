const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritics = mapProperties({
  // keys must match column names in table
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

function list() {
  return knex("movies").select("*");
}

function read(movie_id) {
  return knex("movies").select("*").where({ movie_id }).first();
}

function isShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select(
      "m.movie_id as id",
      "m.title",
      "m.runtime_in_minutes",
      "m.rating",
      "m.description",
      "m.image_url"
    )
    .where({ is_showing: true })
    .groupBy("m.movie_id");
}

function readTheatersPlayingMovie(movie_id) {
  return knex("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .join("theaters as t", "t.theater_id", "mt.theater_id")
    .select("t.*", "mt.*")
    .where({ "m.movie_id": movie_id });
}

function readReviewsForMovie(movie_id) {
  return knex("movies as m")
    .join("reviews as r", "m.movie_id", "r.movie_id")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .where({ "m.movie_id": movie_id })
    .select("r.*", "c.*")
    .then((reviews) => reviews.map(addCritics));
}

module.exports = {
  list,
  isShowing,
  read,
  readTheatersPlayingMovie,
  readReviewsForMovie,
};

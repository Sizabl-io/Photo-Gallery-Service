const { Pool } = require('pg');
const user = require('./credentials.js');

const pool = new Pool(user.credentials);

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
});

let client;

// async/await - check out a client from the pool
const connectToClient = async () => {
  client = await pool.connect();
  console.log('Connected to pool!');
  // set the default schema
  const res = await client.query('SET search_path to public');
};

const releaseClient = async () => {
  // Make sure to release the client before any error handling,
  // just in case the error handling itself throws an error.
  client.release();
  console.log('Released the client');
};

const insertRestaurant = async (document, cb) => {
  const { restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip } = document;
  try {
    const res = await client.query('EXPLAIN ANALYZE INSERT into restaurants(restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip]);
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

const selectRestaurantByID = async (id, cb) => {
  try {
    const res = await client.query(`EXPLAIN ANALYZE SELECT * from restaurants WHERE restaurant_id = ${id}`);
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

const insertUser = async (document, cb) => {
  const { user_url, user_name, user_review_count, user_friend_count, user_photo_count, user_elite_status, user_profile_image } = document;
  try {
    const res = await client.query('INSERT into users(user_url, user_name, user_review_count, user_friend_count, user_photo_count, user_elite_status, user_profile_image) VALUES($1, $2, $3, $4, $5, $6, $7)', [user_url, user_name, user_review_count, user_friend_count, user_photo_count, user_elite_status, user_profile_image]);
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

const selectUserByID = async (id, cb) => {
  try {
    const res = await client.query(`EXPLAIN ANALYZE SELECT * from users WHERE user_id = ${id}`);
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

const insertPhoto = async (document, cb) => {
  const { restaurant_id, user_id, helpful_count, not_helpful_count, photo_url, caption, upload_date } = document;
  try {
    const res = await client.query('INSERT into photos(restaurant_id, user_id, helpful_count, not_helpful_count, photo_url, caption, upload_date) VALUES($1, $2, $3, $4, $5, $6, $7)', [restaurant_id, user_id, helpful_count, not_helpful_count, photo_url, caption, upload_date]);
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

const selectPhotoByID = async (id, cb) => {
  try {
    const res = await client.query(`EXPLAIN ANALYZE SELECT * from photos WHERE photo_id = ${id}`);
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

// count the number of table rows
const countRows = async (table) => {
  const res = await client.query(`EXPLAIN ANALYZE SELECT reltuples::bigint AS estimate FROM pg_class where relname='${table}'`);
  return res.rows[0].estimate;
}

const getClient = () => {
  return client;
}

module.exports = {
  connectToClient,
  releaseClient,
  insertRestaurant,
  selectRestaurantByID,
  insertUser,
  selectUserByID,
  insertPhoto,
  selectPhotoByID,
  countRows,
  getClient,
};
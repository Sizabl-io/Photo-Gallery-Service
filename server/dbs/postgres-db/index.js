const { Pool } = require('pg');
const user = require('./credentials.js');
const { query } = require('express');

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

const insertRestaurant = async (document, analyze, cb) => {
  const { restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip } = document;
  const query = `${analyze ? 'EXPLAIN ANALYZE ' : ''}INSERT into restaurants(restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip) VALUES($1, $2, $3, $4, $5, $6, $7, $8)`;
  try {
    const res = await client.query(query, [restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip]);
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

const selectRestaurantByID = async (restaurant_id, analyze, cb) => {
  const query = `${analyze ? 'EXPLAIN ANALYZE ' : ''}SELECT * from restaurants WHERE restaurant_id = $1`;
  try {
    const res = await client.query(query, [restaurant_id]);
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

const deleteRestaurantByID = async(restaurant_id, analyze, cb) => {
  const query = `${analyze ? 'EXPLAIN ANALYZE ' : ''}DELETE from restaurants WHERE restaurant_id = $1`;
  try {
    const res = await client.query(query, [restaurant_id]);
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

const insertUser = async (document, analyze, cb) => {
  const { user_url, user_name, user_review_count, user_friend_count, user_photo_count, user_elite_status, user_profile_image } = document;
  const query = `${analyze ? 'EXPLAIN ANALYZE ' : ''}INSERT into users(user_url, user_name, user_review_count, user_friend_count, user_photo_count, user_elite_status, user_profile_image) VALUES($1, $2, $3, $4, $5, $6, $7)`;
  try {
    const res = await client.query(query, [user_url, user_name, user_review_count, user_friend_count, user_photo_count, user_elite_status, user_profile_image]);
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

// select users by id
const selectUserByID = async (user_id, analyze, cb) => {
  const query = `${analyze ? 'EXPLAIN ANALYZE ' : ''}SELECT * from users WHERE user_id = $1`;
  try {
    const res = await client.query(query, [user_id]);
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

// delete users by id
const deleteUserByID = async(user_id, analyze, cb) => {
  const query = `${analyze ? 'EXPLAIN ANALYZE ' : ''}DELETE from users WHERE user_id = $1`;
  try {
    const res = await client.query(query, [user_id]);
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

// insert a photo
const insertPhoto = async (document, analyze, cb) => {
  const { restaurant_id, user_id, helpful_count, not_helpful_count, photo_url, caption, upload_date } = document;
  const query = `${analyze ? 'EXPLAIN ANALYZE ' : ''}INSERT into photos(restaurant_id, user_id, helpful_count, not_helpful_count, photo_url, caption, upload_date) VALUES($1, $2, $3, $4, $5, $6, $7)`
  try {
    const res = await client.query(query, [restaurant_id, user_id, helpful_count, not_helpful_count, photo_url, caption, upload_date]);
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

// select photos by restaurant id
const selectPhotoByID = async (restaurant_id, analyze, cb) => {
  const query = `${analyze ? 'EXPLAIN ANALYZE ' : ''}SELECT * from photos WHERE restaurant_id = $1`;
  try {
    const res = await client.query(query, [restaurant_id]);
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

// delete a photo by photo id
const deletePhotoByID = async(photo_id, analyze, cb) => {
  const query = `${analyze ? 'EXPLAIN ANALYZE ' : ''}DELETE from photos WHERE photo_id = $1`;
  try {
    const res = await client.query(query, [photo_id]);
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

const getClient = () => {
  return client;
}

module.exports = {
  connectToClient,
  releaseClient,
  insertRestaurant,
  selectRestaurantByID,
  deleteRestaurantByID,
  insertUser,
  selectUserByID,
  deleteUserByID,
  insertPhoto,
  selectPhotoByID,
  deletePhotoByID,
  getClient,
};
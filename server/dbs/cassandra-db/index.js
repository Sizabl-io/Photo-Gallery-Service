const cassandra = require('cassandra-driver');
const { v4: uuidv4 } = require('uuid');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'gallery',
});

const insertRestaurant = async (document, cb) => {
  const { restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip } = document;
  const restaurant_uuid = uuidv4();
  try {
    const res = await client.execute('INSERT INTO restaurants (restaurant_uuid, restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip) VALUES (?, ?, ? ,?, ?, ?, ?, ?, ?)', [restaurant_uuid, restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip], { prepare: true });
    cb(null, restaurant_uuid);
  } catch (err) {
    cb(err, null);
  }
}

const insertPhoto = async (document, cb) => {
  const { restaurant_uuid, photo_url, upload_date, helpful_count, not_helpful_count, caption, user_url, user_profile_image, user_name, user_elite_status, user_review_count, user_friend_count, user_photo_count } = document;
  // use random photo and user ids
  const photo_uuid = uuidv4();
  const user_uuid = uuidv4();
  try {
    const res = await client.execute(`INSERT INTO photos_by_restaurant (restaurant_uuid, photo_uuid, photo_url, upload_date, helpful_count, not_helpful_count, caption, user_uuid, user_url, user_profile_image, user_name, user_elite_status, user_review_count, user_friend_count, user_photo_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [restaurant_uuid, photo_uuid, photo_url, upload_date, helpful_count, not_helpful_count, caption, user_uuid, user_url, user_profile_image, user_name, user_elite_status, user_review_count, user_friend_count, user_photo_count], { prepare: true });
    cb(null, photo_uuid);
  } catch (err) {
    cb(err, null);
  }
}

// select a photo by restaurant_uuid
const selectPhotoByID = async (restaurant_uuid, cb) => {
  try {
    const res = await client.execute(`SELECT * FROM photos_by_restaurant WHERE restaurant_uuid = ?`, [restaurant_uuid], { prepare: true });
    cb(null, res);
  } catch(err) {
    cb(err, null);
  }
}

module.exports = {
  insertRestaurant,
  insertPhoto,
  selectPhotoByID,
};
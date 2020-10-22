const cassandra = require('cassandra-driver');

// connect to the cassandra keyspace/datacenter
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'gallery',
});

// insert a restaurant
const insertRestaurant = async (document, cb) => {
  const { restaurant_uuid, restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip } = document;
  try {
    const res = await client.execute('INSERT INTO restaurants (restaurant_uuid, restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip) VALUES (?, ?, ? ,?, ?, ?, ?, ?, ?)', [restaurant_uuid, restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip], { prepare: true });
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

// select a restaurant by UUID
const selectRestaurantByID = async (restaurant_uuid, cb) => {
  try {
    const res = await client.execute(`SELECT * FROM restaurants WHERE restaurant_uuid = ?`, [restaurant_uuid], { prepare: true });
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

// select a restaurant by name
const selectRestaurantByName = async (restaurant_name, cb) => {
  try {
    const res = await client.execute(`SELECT * FROM restaurants WHERE restaurant_name = ?`, [restaurant_name], { prepare: true });
    console.log(restaurant_name);
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

// insert a photo with associated user data
const insertPhoto = async (document, cb) => {
  const { restaurant_uuid, photo_uuid, photo_url, upload_date, helpful_count, not_helpful_count, caption, user_uuid, user_url, user_profile_image, user_name, user_elite_status, user_review_count, user_friend_count, user_photo_count } = document;
  // use random photo and user ids
  try {
    const res = await client.execute(`INSERT INTO photos_by_restaurant (restaurant_uuid, photo_uuid, photo_url, upload_date, helpful_count, not_helpful_count, caption, user_uuid, user_url, user_profile_image, user_name, user_elite_status, user_review_count, user_friend_count, user_photo_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [restaurant_uuid, photo_uuid, photo_url, upload_date, helpful_count, not_helpful_count, caption, user_uuid, user_url, user_profile_image, user_name, user_elite_status, user_review_count, user_friend_count, user_photo_count], { prepare: true });
    cb(null, res);
  } catch (err) {
    cb(err, null);
  }
}

// select photos by restaurant UUID
const selectPhotoByID = async (restaurant_uuid, cb) => {
  try {
    const res = await client.execute(`SELECT * FROM photos_by_restaurant WHERE restaurant_uuid = ?`, [restaurant_uuid], { prepare: true });
    cb(null, res);
  } catch(err) {
    cb(err, null);
  }
}

// delete a photo by restaurant/photo UUID
const deletePhotoByID = async (restaurant_uuid, photo_uuid, cb) => {
  try {
    const res = await client.execute(`DELETE FROM photos_by_restaurant WHERE restaurant_uuid = ? AND photo_uuid = ? IF EXISTS`, [restaurant_uuid, photo_uuid], { prepare: true });
    cb(null, res);
  } catch(err) {
    cb(err, null);
  }
}

module.exports = {
  insertRestaurant,
  selectRestaurantByID,
  selectRestaurantByName,
  insertPhoto,
  selectPhotoByID,
  deletePhotoByID,
};
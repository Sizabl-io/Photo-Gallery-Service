const db = require('./db.js');
const perf = require('execution-time')();
const fs = require('fs');
const path = require('path');

const testAll = async () => {
  let results = [];
  await db.connectToPool();
  const restaurantDoc = {
    restaurant_name: 'Farmhouse Kitchen Thai Cuisine',
    site_url: 'https://farmhousethai.com/',
    phone_number: '415-814-2920',
    city: 'San Francisco',
    street: '710 Florida St.',
    state_or_province: 'CA',
    country: 'US',
    zip: '94110',
  };
  const userDoc = {
    user_url: 'http://sizabl.io/users/diao',
    user_name: 'diao',
    uesr_review_count: 1000,
    user_friend_count: 1000,
    user_photo_count: 99,
    user_elite_status: true,
    user_profile_image: 'https://i.imgur.com/fPmznir.jpg',
  };
  const photoDoc = {
    restaurant_id: 1,
    user_id: 1,
    helpful_count: 100,
    not_helpful_count: 100,
    photo_url: 'https://www.cliseetiquette.com/wp-content/uploads/2019/09/waiter-serving-food.jpg',
    caption: 'Fine dining',
    upload_date: Date.now(),
  };
  const numRestaurantRecords = await db.countRows('restaurants');
  const numUserRecords = await db.countRows('users');
  const numPhotoRecords = await db.countRows('photos');

  perf.start('insertRestaurant');
  await db.insertRestaurant(restaurantDoc, (err, data) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('insertRestaurant');
    result.numRows = numRestaurantRecords;
    results.push(result);
  });
  perf.start('selectRestaurant');
  await db.selectRestaurant(100, async (err, data) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('selectRestaurant');
    result.numRows = numRestaurantRecords;
    results.push(result);
  });

  perf.start('insertUser');
  await db.insertUser(userDoc, (err, data) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('insertUser');
    result.numRecords = numUserRecords;
    results.push(result);
  });
  perf.start('selectUser');
  await db.selectUser(100, (err, data) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('selectUser');
    result.numRecords = numUserRecords;
    results.push(result);
  });

  perf.start('insertPhoto');
  await db.insertPhoto(photoDoc, (err, data) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('insertPhoto');
    result.numRecords = numPhotoRecords;
    results.push(result);
  });
  perf.start('selectPhoto');
  await db.selectUser(100, (err, data) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('selectPhoto');
    result.numRecords = numPhotoRecords;
    results.push(result);
  });

  await db.releasePool();
  fs.writeFileSync(path.join(__dirname, 'generated', 'time.txt'), JSON.stringify(results));
}

testAll();
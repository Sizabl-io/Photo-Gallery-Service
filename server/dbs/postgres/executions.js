const db = require('./db.js');
const perf = require('execution-time')();
const fs = require('fs');
const path = require('path');

const testAll = async () => {
  let timingResults = [];
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
  perf.start('insertRestaurant');
  await db.insertRestaurant(restaurantDoc, (err, data) => {
    if (err) {
      throw err;
    }
    timingResults.push(perf.stop('insertRestaurant'));
  });
  perf.start('insertUser');
  await db.insertUser(userDoc, (err, data) => {
    if (err) {
      throw err;
    }
    timingResults.push(perf.stop('insertUser'));
  });
  perf.start('insertPhoto');
  await db.insertPhoto(photoDoc, (err, data) => {
    if (err) {
      throw err;
    }
    timingResults.push(perf.stop('insertPhoto'));
  });

  perf.start('selectRestaurant');
  await db.selectRestaurant('Farmhouse Kitchen Thai Cuisine', (err, data) => {
    if (err) {
      throw err;
    }
    timingResults.push(perf.stop('selectRestaurant'));
  });

  await db.releasePool();
  fs.writeFileSync(path.join(__dirname, 'generated', 'time.txt'), JSON.stringify(timingResults));
}

testAll();
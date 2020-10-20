const pgDB = require('./postgres-db');
const cDB = require('./cassandra-db');
const perf = require('execution-time')();
const fs = require('fs');
const path = require('path');

// measures the execution times for Postgres insert/read operations
const testPostgres = async () => {
  let results = [];

  // get a client to connect to the database
  await pgDB.connectToClient();

  // test documents
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

  // count the number of records in each table
  const numRestaurantRecords = await pgDB.countRows('restaurants');
  const numUserRecords = await pgDB.countRows('users');
  const numPhotoRecords = await pgDB.countRows('photos');

  // restaurant table measurements
  perf.start('insertRestaurant');
  await pgDB.insertRestaurant(restaurantDoc, (err, data) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('insertRestaurant');
    result.numRows = numRestaurantRecords;
    results.push(result);
  });

  perf.start('selectRestaurant');
  await pgDB.selectRestaurant(100, async (err, data) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('selectRestaurant');
    result.numRows = numRestaurantRecords;
    results.push(result);
  });

  // user table measurements
  perf.start('insertUser');
  await pgDB.insertUser(userDoc, (err, data) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('insertUser');
    result.numRecords = numUserRecords;
    results.push(result);
  });

  perf.start('selectUser');
  await pgDB.selectUser(100, (err, data) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('selectUser');
    result.numRecords = numUserRecords;
    results.push(result);
  });

  // photo table measurements
  perf.start('insertPhoto');
  await pgDB.insertPhoto(photoDoc, (err, data) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('insertPhoto');
    result.numRecords = numPhotoRecords;
    results.push(result);
  });

  perf.start('selectPhoto');
  await pgDB.selectUser(100, (err, data) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('selectPhoto');
    result.numRecords = numPhotoRecords;
    results.push(result);
  });

  // release the pool
  await pgDB.releaseClient();

  // generate the JSON file
  fs.writeFileSync(path.join(__dirname, 'generated', 'time.json'), JSON.stringify(results));
};

const testCassandra = async () => {
  await client.execute(query
}

testPostgres();
testCassandra();
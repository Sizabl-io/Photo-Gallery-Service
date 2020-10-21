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
    upload_date: Date.now().toString(),
  };

  // count the number of records in each table
  const numRestaurantRecords = await pgDB.countRows('restaurants');
  const numUserRecords = await pgDB.countRows('users');
  const numPhotoRecords = await pgDB.countRows('photos');

  // restaurant table measurements
  perf.start('Postgres: insertRestaurant');
  await pgDB.insertRestaurant(restaurantDoc, (err, data) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('Postgres: insertRestaurant');
    result.numRows = numRestaurantRecords;
    results.push(result);
  });

  perf.start('Postgres: selectRestaurant');
  await pgDB.selectRestaurant(100, async (err, data) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('Postgres: selectRestaurant');
    result.numRows = numRestaurantRecords;
    results.push(result);
  });

  // user table measurements
  perf.start('Postgres: insertUser');
  await pgDB.insertUser(userDoc, (err, data) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('Postgres: insertUser');
    result.numRecords = numUserRecords;
    results.push(result);
  });

  perf.start('Postgres: selectUser');
  await pgDB.selectUser(100, (err, data) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('Postgres: selectUser');
    result.numRecords = numUserRecords;
    results.push(result);
  });

  // photo table measurements
  perf.start('Postgres: insertPhoto');
  await pgDB.insertPhoto(photoDoc, (err, data) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('Postgres: insertPhoto');
    result.numRecords = numPhotoRecords;
    results.push(result);
  });

  perf.start('Postgres: selectPhoto');
  await pgDB.selectUser(100, (err, data) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('Postgres: selectPhoto');
    result.numRecords = numPhotoRecords;
    results.push(result);
  });

  // release the pool
  await pgDB.releaseClient();

  // generate the JSON file
  fs.writeFileSync(path.join(__dirname, 'generated', 'postgres_benchmark.json'), JSON.stringify(results));
};

const testCassandra = async () => {
  let results = [];
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

  let inserted_restaurant_id = null;

  perf.start('Cassandra: insertRestaurant');
  await cDB.insertRestaurant(restaurantDoc, (err, id) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('Cassandra: insertRestaurant');
    inserted_restaurant_id = id;
    results.push(result);
  });

  const photoDoc = {
    restaurant_uuid: inserted_restaurant_id,
    photo_url: 'https://www.cliseetiquette.com/wp-content/uploads/2019/09/waiter-serving-food.jpg',
    upload_date: Date.now().toString(),
    helpful_count: 100,
    not_helpful_count: 100,
    caption: 'Fine dining',
    user_url: 'http://sizabl.io/users/diao',
    user_profile_image: 'https://i.imgur.com/fPmznir.jpg',
    user_name: 'diao',
    user_elite_status: true,
    uesr_review_count: 1000,
    user_friend_count: 1000,
    user_photo_count: 99,
  };

  perf.start('Cassandra: insertPhoto');
  await cDB.insertPhoto(photoDoc, (err, id) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('Postgres: insertPhoto');
    results.push(result);
  });

  perf.start('Cassandra: selectPhoto');
  await cDB.selectPhoto(inserted_restaurant_id, (err, id) => {
    if (err) {
      throw err;
    }
    const result = perf.stop('Cassandra: selectPhoto');
    results.push(result);
  });

  fs.writeFileSync(path.join(__dirname, 'generated', 'cassandra_benchmark.json'), JSON.stringify(results));
}

testPostgres();
testCassandra();
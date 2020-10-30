const pgDB = require('./postgres-db');
const cDB = require('./cassandra-db');
const perf = require('execution-time')();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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
  // const numRestaurantRecords = await pgDB.countRows('restaurants');
  // const numUserRecords = await pgDB.countRows('users');
  // const numPhotoRecords = await pgDB.countRows('photos');

  // restaurant table measurements
  await pgDB.insertRestaurant(restaurantDoc, true, (err, data) => {
    if (err) {
      throw err;
    }
    results.push(data.rows);
  });

  await pgDB.selectRestaurantByID(100, true, (err, data) => {
    if (err) {
      throw err;
    }
    results.push(data.rows);
  });

  // await pgDB.deleteRestaurantByID(100, true, (err, data) => {
  //   if (err) {
  //     throw err;
  //   }
  //   results.push(data.rows);
  // });

  // user table measurements
  await pgDB.insertUser(userDoc, true, (err, data) => {
    if (err) {
      throw err;
    }
    results.push(data.rows);
  });

  await pgDB.selectUserByID(100, true, (err, data) => {
    if (err) {
      throw err;
    }
    results.push(data.rows);
  });

  // await pgDB.deleteUserByID(100, true, (err, data) => {
  //   if (err) {
  //     throw err;
  //   }
  //   results.push(data.rows);
  // })

  let inserted_id;

  // photo table measurements
  await pgDB.insertPhoto(photoDoc, true, (err, data) => {
    if (err) {
      throw err;
    }
    results.push(data.rows);
  });

  await pgDB.selectPhotoByID(100, true, (err, data) => {
    if (err) {
      throw err;
    }
    results.push(data.rows);
  });

  await pgDB.deletePhotoByID(Math.round(Math.random() * 50000000), true, (err, data) => {
    if (err) {
      throw err;
    }
    results.push(data.rows);
  });

  // release the pool
  await pgDB.releaseClient();

  // generate the JSON file
  fs.writeFileSync(path.join(__dirname, 'generated', 'postgres_benchmark.json'), JSON.stringify(results));
};

const testCassandra = async () => {
  console.log('Running Cassandra tests...');
  let results = [];
  const restaurantDoc = {
    restaurant_uuid: uuidv4(),
    restaurant_name: 'Farmhouse Kitchen Thai Cuisine',
    site_url: 'https://farmhousethai.com/',
    phone_number: '415-814-2920',
    city: 'San Francisco',
    street: '710 Florida St.',
    state_or_province: 'CA',
    country: 'US',
    zip: '94110',
  };

  perf.start('insertRestaurant')
  await cDB.insertRestaurant(restaurantDoc, (err, res) => {
    if (err) {
      throw err;
    }
    const timing = perf.stop('insertRestaurant');
    results.push(timing);
  });


  perf.start('selectRestaurantByID');
  await cDB.selectRestaurantByID(restaurantDoc.restaurant_uuid, (err, res) => {
    const timing = perf.stop('selectRestaurantByID');
    results.push(timing);
  });

  perf.start('selectRestaurantByName');
  await cDB.selectRestaurantByName(restaurantDoc.restaurant_name, (err, res) => {
    const timing = perf.stop('selectRestaurantByName');
    results.push(timing);
  });

  const photoDoc = {
    restaurant_uuid: restaurantDoc.restaurant_uuid,
    photo_uuid: uuidv4(),
    user_uuid: uuidv4(),
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

  perf.start('insertPhoto');
  await cDB.insertPhoto(photoDoc, (err, res) => {
    if (err) {
      throw err;
    }
    const timing = perf.stop('insertPhoto');
    results.push(timing);
  });

  perf.start('selectPhotoByID');
  await cDB.selectPhotoByID(photoDoc.restaurant_uuid, (err, res) => {
    if (err) {
      throw err;
    };
    const timing = perf.stop('selectPhotoByID');
    results.push(timing);
  });

  perf.start('deletePhotoByID');
  await cDB.deletePhotoByID(photoDoc.restaurant_uuid, photoDoc.photo_uuid, (err, res) => {
    if (err) {
      throw err;
    };
    const timing = perf.stop('deletePhotoByID');
    results.push(timing);
  });

  fs.writeFileSync(path.join(__dirname, 'generated', 'cassandra_benchmark.json'), JSON.stringify(results));
  console.log('Finished Cassandra tests!');
}

const testAll = async () => {
  await testPostgres();
  await testCassandra();
}

testAll();

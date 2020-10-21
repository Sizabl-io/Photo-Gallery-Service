const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const faker = require('faker/locale/en');
const _ = require('underscore');
const path = require('path');
const restaurant = require('./restaurant-data');
const { v4: uuidv4 } = require('uuid');

const numRecords = 5000000;
const numDocuments = 5;
const chunkSize = numRecords / numDocuments;

let photo_id = 1;
let restaurant_id = 1;

// number of random samples
const numSamples = 5000;

const randomSample = () => {
  return Math.floor(Math.random() * numSamples);
}

// randomly sample fake data to improve csv generation speed
let randomPool = {
  site_url: [],
  restaurant_name: [],
  phone_number: [],
  city: [],
  street: [],
  state_or_province: [],
  country: [],
  zip: [],
  photo_url: [],
  upload_date: [],
  helpfulCount: [],
  notHelpfulCount: [],
  caption: [],
  user_id: [],
  user_url: [],
  user_profile_image: [],
  user_name: [],
  user_elite_status: [],
  user_review_count: [],
  user_friend_count: [],
  user_photo_count: [],
}


for (let i = 0; i < numSamples; i++) {
  faker.seed(i);
  randomPool.site_url.push(faker.internet.domainName());
  const randomRestaurantIndex = Math.floor(Math.random() * restaurant.data.length);
  const formattedRestaurantName = restaurant.data[randomRestaurantIndex].replace(/ +(?= )/g,''); //replace multiple spaces with single space
  randomPool.restaurant_name.push(formattedRestaurantName);
  randomPool.phone_number.push(faker.phone.phoneNumber());
  randomPool.city.push(faker.address.city());
  randomPool.street.push(faker.address.streetName());
  randomPool.state_or_province.push(faker.address.stateAbbr());
  // randomPool.country.push(faker.address.countryCode());
  randomPool.zip.push(faker.address.zipCode());
  randomPool.upload_date.push(faker.date.past());
  const numSentences = faker.random.number(20) + 10;
  randomPool.caption.push(faker.lorem.sentence(numSentences));
  randomPool.user_id.push(i+1);
  const username = faker.internet.userName().replace('.', '');
  randomPool.user_url.push(`http://sizabl.io/users/${username}`);
  randomPool.user_profile_image.push(`https://photo-gallery-photos.s3-us-west-1.amazonaws.com/profile_pictures/${i+1}.jpg}`);
  randomPool.user_name.push(`${faker.name.firstName()} ${faker.name.lastName()}`);
  randomPool.user_elite_status.push(faker.random.boolean());
  randomPool.user_review_count.push(Math.round(Math.random() * 500));
  randomPool.user_friend_count.push(Math.round(Math.random() * 1000));
  randomPool.user_photo_count.push(Math.round(Math.random() * 500));
}

// generate (chunkSize) number of restaurant records with random number of photos
const generateRestaurantRecords = async (index) => {
  console.log(`Generating restaurant CSV #${index}...`);

  let pgRestaurantRecords = [];
  let pgUserRecords = [];
  let pgPhotoRecords = [];
  let cRestaurantRecords = [];
  let cPhotoRecords = [];
  // the number of unique photos on S3
  const maxPhotoID = 1000;

  for (let i = 0; i < chunkSize; i++) {
    const restaurant_uuid = uuidv4(); // uuid for cassandra
    const site_url = randomPool.site_url[randomSample()];
    const restaurant_name = randomPool.restaurant_name[randomSample()];
    const phone_number = randomPool.phone_number[randomSample()];
    const city = randomPool.city[randomSample()];
    const street = randomPool.street[randomSample()];
    const state_or_province = randomPool.state_or_province[randomSample()];
    const country = 'US';
    const zip = randomPool.zip[randomSample()];

    const pgRestaurantRecord = {
      restaurant_id,
      restaurant_name,
      site_url,
      phone_number,
      city,
      street,
      state_or_province,
      country,
      zip,
    }

    const cRestaurantRecord = {
      restaurant_uuid,
      restaurant_name,
      site_url,
      phone_number,
      city,
      street,
      state_or_province,
      country,
      zip
    }
    // number of photos for the specific restaurant
    const numPhotos = Math.ceil(Math.random() * 10);

    for (let j = 0; j < numPhotos; j++) {
      const user_id = randomSample();
      const photo_uuid = uuidv4(); // uuid for cassandra
      const user_uuid = uuidv4(); // uuid for cassandra
      const photo_url = `https://photo-gallery-photos.s3-us-west-1.amazonaws.com/food/${Math.ceil(Math.random() * maxPhotoID)}.jpg`;
      const upload_date = randomPool.upload_date[randomSample()];
      const helpful_count = Math.round(Math.random() * 200);
      const not_helpful_count = Math.round(Math.random() * 200);
      const caption = randomPool.caption[randomSample()];
      const user_url = randomPool.user_url[user_id];
      const user_profile_image = randomPool.user_profile_image[user_id];
      const user_name = randomPool.user_name[user_id];
      const user_elite_status = randomPool.user_elite_status[user_id];
      const user_review_count = randomPool.user_review_count[user_id];
      const user_friend_count = randomPool.user_friend_count[user_id];
      const user_photo_count = randomPool.user_photo_count[user_id];

      const pgUserRecord = {
        user_id,
        user_url,
        user_name,
        user_review_count,
        user_friend_count,
        user_photo_count,
        user_elite_status,
        user_profile_image,
      }

      const pgPhotoRecord = {
        photo_id,
        restaurant_id,
        user_id,
        helpful_count,
        not_helpful_count,
        photo_url,
        caption,
        upload_date,
      }

      const cPhotoRecord = {
        restaurant_uuid,
        photo_uuid,
        photo_url,
        upload_date,
        helpful_count,
        not_helpful_count,
        caption,
        user_uuid,
        user_url,
        user_profile_image,
        user_name,
        user_elite_status,
        user_review_count,
        user_friend_count,
        user_photo_count,
      }
      pgUserRecords.push(pgUserRecord);
      pgPhotoRecords.push(pgPhotoRecord);
      cPhotoRecords.push(cPhotoRecord);
      photo_id += 1;
    }

    pgRestaurantRecords.push(pgRestaurantRecord);
    cRestaurantRecords.push(cRestaurantRecord);
    restaurant_id += 1;
  }

  // postgres csv writer
  const pgRestaurantWriter = createCsvWriter({
    header: [
              {id: 'restaurant_id', title: 'restaurant_id'},
              {id: 'restaurant_name' , title: 'restaurant_name'},
              {id: 'site_url', title: 'site_url'},
              {id: 'phone_number' , title: 'phone_number'},
              {id: 'city' , title: 'city'},
              {id: 'street' , title: 'street'},
              {id: 'state_or_province' , title: 'state_or_province'},
              {id: 'country' , title: 'country'},
              {id: 'zip' , title: 'zip'},
            ],
    path: path.join(__dirname, 'generated', 'postgres', 'restaurants', `restaurants_${index}.csv`),
  });

  // cassandra restaurant writer
  const cRestaurantWriter = createCsvWriter({
    header: [
              {id: 'restaurant_uuid', title: 'restaurant_uuid'},
              {id: 'restaurant_name' , title: 'restaurant_name'},
              {id: 'site_url', title: 'site_url'},
              {id: 'phone_number' , title: 'phone_number'},
              {id: 'city' , title: 'city'},
              {id: 'street' , title: 'street'},
              {id: 'state_or_province' , title: 'state_or_province'},
              {id: 'country' , title: 'country'},
              {id: 'zip' , title: 'zip'},
            ],
    path: path.join(__dirname, 'generated', 'cassandra','restaurants', `restaurants_${index}.csv`),
  });

  // pg photo writer
  const pgPhotoWriter = createCsvWriter({
    header: [
              {id: 'photo_id', title: 'photo_id'},
              {id: 'restaurant_id', title: 'restaurant_id'},
              {id: 'user_id' , title: 'user_id'},
              {id: 'helpful_count' , title: 'helpful_count'},
              {id: 'not_helpful_count' , title: 'not_helpful_count'},
              {id: 'photo_url' , title: 'photo_url'},
              {id: 'upload_date' , title: 'upload_date'},
              {id: 'caption' , title: 'caption'},
            ],
    path: path.join(__dirname, 'generated', 'postgres', 'photos', `photos_${index}.csv`),
  });

  // pg user writer
  const pgUserWriter = createCsvWriter({
    header: [
              {id: 'user_id', title: 'user_id'},
              {id: 'user_url', title: 'user_url'},
              {id: 'user_name' , title: 'user_name'},
              {id: 'user_review_count' , title: 'user_review_count'},
              {id: 'user_friend_count' , title: 'user_friend_count'},
              {id: 'user_photo_count' , title: 'user_photo_count'},
              {id: 'user_elite_status' , title: 'user_elite_status'},
              {id: 'user_profile_image' , title: 'user_profile_image'},
            ],
    path: path.join(__dirname, 'generated', 'postgres', 'users', `users_${index}.csv`),
  });

  // cassandra photo/user writer
  const cPhotoWriter = createCsvWriter({
    header: [
              {id: 'restaurant_uuid', title: 'restaurant_uuid'},
              {id: 'photo_uuid' , title: 'photo_uuid'},
              {id: 'photo_url' , title: 'photo_url'},
              {id: 'upload_date' , title: 'upload_date'},
              {id: 'helpful_count' , title: 'helpful_count'},
              {id: 'not_helpful_count' , title: 'not_helpful_count'},
              {id: 'caption' , title: 'caption'},
              {id: 'user_uuid' , title: 'user_uuid'},
              {id: 'user_url' , title: 'user_url'},
              {id: 'user_profile_image' , title: 'user_profile_image'},
              {id: 'user_name' , title: 'user_name'},
              {id: 'user_elite_status' , title: 'user_elite_status'},
              {id: 'user_review_count' , title: 'user_review_count'},
              {id: 'user_friend_count' , title: 'user_friend_count'},
              {id: 'user_photo_count' , title: 'user_photo_count'}
            ],
    path: path.join(__dirname, 'generated', 'cassandra', 'photos', `photos_${index}.csv`),
  });

  // set max number of records to write at a time to avoid overflow
  const numRecordsToWrite = 1000;
  pgRestaurantRecords = _.chunk(pgRestaurantRecords, numRecordsToWrite);
  cRestaurantRecords = _.chunk(cRestaurantRecords, numRecordsToWrite);
  pgUserRecords = _.chunk(pgUserRecords, numRecordsToWrite);
  pgPhotoRecords = _.chunk(pgPhotoRecords, numRecordsToWrite);
  cPhotoRecords = _.chunk(cPhotoRecords, numRecordsToWrite);

  for (let i = 0; i < pgRestaurantRecords.length; i++) {
    await pgRestaurantWriter.writeRecords(pgRestaurantRecords[i]);
    console.log(`Wrote Postgres restaurant record CSV #${index} chunk #${i}!`);
  }

  for (let i = 0; i < cRestaurantRecords.length; i++) {
    await cRestaurantWriter.writeRecords(cRestaurantRecords[i]);
    console.log(`Wrote Cassandra restaurant record CSV #${index} chunk #${i}!`);
  }

  for (let i = 0; i < pgUserRecords.length; i++) {
    await pgUserWriter.writeRecords(pgUserRecords[i]);
    console.log(`Wrote Postgres user record CSV #${index} chunk #${i}!`);
  }

  for (let i = 0; i < pgPhotoRecords.length; i++) {
    await pgPhotoWriter.writeRecords(pgPhotoRecords[i]);
    console.log(`Wrote Postgres photo record CSV #${index} chunk #${i}!`);
  }

  for (let i = 0; i < cPhotoRecords.length; i++) {
    await cPhotoWriter.writeRecords(cPhotoRecords[i]);
    console.log(`Wrote Cassandra photo record CSV #${index} chunk #${i}!`);
  }
};

const generateCSVRecords = async () => {
  for (let i = 0; i < numDocuments; i++) {
    await generateRestaurantRecords(i);
  }
}

generateCSVRecords();
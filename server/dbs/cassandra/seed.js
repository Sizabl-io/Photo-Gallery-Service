const db = require('./db.js');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const faker = require('faker/locale/en');
const _ = require('underscore');
const path = require('path');
const Faker = require('faker/lib');
const { random } = require('underscore');
const restaurant = require('./restaurants.js');

console.log(`Number of restaurants: ${restaurant.data.length}`);

const numSamples = 1000;
const chunkSize = 10;

const sample = () => {
  return Math.floor(Math.random() * numSamples);
}

const seedDB = async () => {
  const res = await db.client.execute('select * from gallery.restaurants');
};

const generateCSVRecord = async (index) => {

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
    helpfulCount: _.range(200),
    notHelpfulCount: _.range(200),
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
    const formattedRestaurantName = restaurant.data[i].replace(/ +(?= )/g,''); //replace multiple spaces with single space
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

  await generateRestaurantRecords(randomPool, index);
  await generatePhotoRecords(randomPool, index);
}

const generateRestaurantRecords = async (randomPool, index) => {
  console.log('Connecting to restaurant CSV writer...');
  // create the csv writer for restaurants
  const restaurantWriter = createCsvWriter({
    header: [
             {id: 'restaurant_id', title: 'restaurant_id'},
             {id: 'site_url', title: 'site_url'},
             {id: 'restaurant_name' , title: 'restaurant_name'},
             {id: 'phone_number' , title: 'phone_number'},
             {id: 'city' , title: 'city'},
             {id: 'street' , title: 'street'},
             {id: 'state_or_province' , title: 'state_or_province'},
             {id: 'country' , title: 'country'},
             {id: 'zip' , title: 'zip'},
            ],
    path: path.join(__dirname, 'generated', 'restaurants', `restaurants_${index}.csv`),
  });

  let restaurantRecords = [];

  const offset = chunkSize*index;

  for (let i = offset; i < offset + chunkSize + 1; i++) {
    const record =
      {
        restaurant_id: i,
        site_url: randomPool.site_url[sample()],
        restaurant_name: randomPool.restaurant_name[sample()],
        phone_number: randomPool.phone_number[sample()],
        city: randomPool.city[sample()],
        street: randomPool.street[sample()],
        state_or_province: randomPool.state_or_province[sample()],
        country: 'US',
        zip: randomPool.zip[sample()],
      };
    console.log(`Created restaurant record #${i}`);
    restaurantRecords.push(record);
  }

  await restaurantWriter.writeRecords(restaurantRecords);
  console.log('Wrote restaurant records!');
};

const generatePhotoRecords = async (randomPool, index) => {
  console.log('Connecting to photo CSV writer...');
  const photoWriter = createCsvWriter({
    header: [
              {id: 'photo_id' , title: 'photo_id'},
              {id: 'photo_url' , title: 'photo_url'},
              {id: 'upload_date' , title: 'upload_date'},
              {id: 'helpfulCount' , title: 'helpfulCount'},
              {id: 'notHelpfulCount' , title: 'notHelpfulCount'},
              {id: 'caption' , title: 'caption'},
              {id: 'user_id' , title: 'user_id'},
              {id: 'user_url' , title: 'user_url'},
              {id: 'user_profile_image' , title: 'user_profile_image'},
              {id: 'user_name' , title: 'user_name'},
              {id: 'user_elite_status' , title: 'user_elite_status'},
              {id: 'user_review_count' , title: 'user_review_count'},
              {id: 'user_friend_count' , title: 'user_friend_count'},
              {id: 'user_photo_count' , title: 'user_photo_count'}
            ],
    path: path.join(__dirname, 'generated', 'photos', `photos_${index}.csv`),
  });

  // the number of unique photos on S3
  const maxPhotoID = 1000;

  let photoRecords = [];

  const offset = chunkSize*index;

  for (let i = offset; i < offset + chunkSize + 1; i++) {
    const userId = sample();
    const record =
      {
        photo_id: i,
        photo_url: `https://photo-gallery-photos.s3-us-west-1.amazonaws.com/food/${Math.ceil(Math.random() * maxPhotoID)}.jpg`,
        upload_date: randomPool.upload_date[sample()],
        helpfulCount: Math.round(Math.random() * 200),
        notHelpfulCount: Math.round(Math.random() * 200),
        caption: randomPool.caption[sample()],
        user_id: userId+1, // offset to non-zero
        user_url: randomPool.user_url[userId],
        user_profile_image: randomPool.user_profile_image[userId],
        user_name: randomPool.user_name[userId],
        user_elite_status: randomPool.user_elite_status[userId],
        user_review_count: randomPool.user_review_count[userId],
        user_friend_count: randomPool.user_friend_count[userId],
        user_photo_count: randomPool.user_photo_count[userId],
      };
    photoRecords.push(record);
    console.log(`Created photo record #${i}`);
  }
  await photoWriter.writeRecords(photoRecords);
  console.log('Wrote photo records!');
}

const generateCSVRecords = async () => {
  for (let i = 0; i < 2; i++) {
    await generateCSVRecord(i);
  }
}

generateCSVRecords();
// console.log(numSentences);
// seedDB()
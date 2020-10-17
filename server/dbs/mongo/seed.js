const faker = require('faker');
const mongoose = require('mongoose');
const db = require('./db.js');

const { photo } = db;

const flushDb = () => {
  photo.remove({}, (err, success) => {
    if (err) {
      console.err(err);
    } else {
      console.log('success: ', success);
    }
  });
};

const seedPhotos = () => {
  // clear db
  flushDb();

  const result = [];

  for(let i = 0; i < 100; i++) {

    const dataItem = {};
    dataItem.photoId = i;

    dataItem.imageList = [];
    dataItem.reviewList = [];
    dataItem.helpfulList = [];
    dataItem.notHelpfulList = [];
    dataItem.userList = [];

    // push 15 pictures into image list
    for(let k = 0; k < 15; k++) {
      let randNum = Math.floor(Math.random() * 36);
      let randHelpful = Math.floor(Math.random() * 500);
      let randNotHelpful = Math.floor(Math.random() * 500);
      let randReview = faker.lorem.sentence(25);
      dataItem.userList.push(k);
      // push 15 image urls into imageList
      dataItem.imageList.push(`https://yelp-photos.s3.us-east-2.amazonaws.com/300s+(${randNum}).jpg`);

      dataItem.helpfulList.push(randHelpful);
      dataItem.notHelpfulList.push(randNotHelpful);
      dataItem.reviewList.push(randReview);
    };

    const photoModel = new db.photo(dataItem);
    const savedData = photoModel.save();
    result.push(savedData);
  }

  Promise.all(result)
  .then((results) => {
    console.log('product: ', results);
  })
  .catch((err) => {
    console.error(err);
  })
  .then(() => {
    mongoose.connection.close(() => {
      process.exit(0);
    });
  });

  return result;

}

seedPhotos();
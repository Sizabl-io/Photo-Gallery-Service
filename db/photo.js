const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
  photoId: Number,
  imageList: [String],
  reviewList: [String],
  userList: [Number],
  helpfulList: [Number],
  notHelpfulList: [Number]
});

const photo = mongoose.model('Photox', photoSchema);

module.exports = photo;
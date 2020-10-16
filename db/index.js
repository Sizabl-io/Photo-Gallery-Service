const db = require('./postgres/db.js');

const mongoose = require('mongoose');
const photo = require('./photo.js');

mongoose.connect('mongodb://localhost:27017/photo', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open to: 3001');
});

mongoose.connection.once('open', () => {
  console.log('MongoDb database connection established successfully!');
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose default connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// const schema = mongoose.Schema({
//   userName: 'string',
// });

// const Repo = mongoose.model('Repo', repoSchema);

module.exports = {
  photo: photo,
};
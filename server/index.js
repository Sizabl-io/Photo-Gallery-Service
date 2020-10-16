const express = require('express');
const path = require('path');
const model = require('../db/index.js');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '/../public')));

const getAllPhotos = function(callback) {
  // need to query the database for all users
  // this function will be called in a controller triggered by a GET request
  // need to find how to do it without sqlLite
  console.log(model.photo)
  model.photo.find({}, (err, data) => {
    if (err) {
      throw err;
    } else {
      callback(data);
    }
  });
};

const getPhotoById = (id, callback) => {
  model.photo.find({photoId: id }, (err, data) => {
    if(err) {
      throw err;
    }
    else {
      callback(data);
    }
  });
};



// GET all photos
app.get('/', (req, res) => {
  console.log('Connecting to the pool...');
  db.connectToPool()
    .catch(err => console.log(err.stack));
  res.status(201).send('success!');
});

// GET photo based on id
app.get('/photos/:id', (req, res) => {
  const pageId = req.params.id;
  // cosole.log(model.videogame.find)
  getPhotoById(pageId, (data) => {
    res.status(200).send(data);
  });
});

app.listen(3001, () => {
  console.log('listening on http://localhost:3001');
});

require('newrelic');
const express = require('express');
const path = require('path');
const db = require('./dbs/postgres-db');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '/../public')));

// Restaurant API
app.get('/api/restaurants/:id', (req, res) => {
  const { id } = req.params;
  db.selectRestaurantByID(id, false, (err, data) => {
    res.status(200).send(data.rows[0]);
  });
});

// Gallery API
app.get('/api/galleries/:id', (req, res) => {
  const { id } = req.params;
  // console.log(id);
  db.selectPhotoByID(id, false, (err, data) => {
    res.status(200).send({gallery: data.rows});
  });
});

// Photo API
app.post('/api/photos/', (req, res) => {
  const photo = req.body;
  db.insertPhoto(photo, false, (err, data) => {
    console.log(`${data.command}ed a photo!`);
    res.sendStatus(201);
  });
});

app.patch('/api/photos/id', (req, res) => {
  const photo = req.body;
/*   db.updateOne(photo, false, (err, data) => {
    console.log(`${data.command}ed a photo!`);
    res.sendStatus(201);
  }); */
});

app.delete('/api/photos/:id', (req, res) => {
  const { id } = req.params;
  // console.log(id);
  db.deletePhotoByID(id, false, (err, data) => {
    // console.log(JSON.stringify(data))
    res.sendStatus(200);
  });
});

app.listen(3001, () => {
  console.log('listening on http://localhost:3001');
});

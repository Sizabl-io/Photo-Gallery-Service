require('newrelic');
const express = require('express');
const path = require('path');
// const model = require('./dbs/mongo/db.js');
const db = require('./dbs/postgres-db');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '/../public')));

console.log('Connecting to a client...');
db.connectToClient();
console.log('Connected to client!');

// Restaurant API
app.get('/api/restaurants/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);
  db.selectRestaurantByID(id, false, (err, data) => {
    res.status(200).send(data.rows[0]);
  });
})

// Gallery API
app.get('/api/galleries/:id', (req, res) => {
  const { id } = req.params;
  // console.log(id);
  db.selectPhotoByID(id, false, (err, data) => {
    res.status(200).send({gallery: data.rows});
  });
})

app.post('/api/photos/', (req, res) => {
  const photo = req.body;
  // console.log(JSON.stringify(photo));
  db.insertPhoto(photo, false, (err, data) => {
    // console.log(`${data.command}ed a photo!`);
    res.sendStatus(201);
  });
})


app.listen(3001, () => {
  console.log('listening on http://localhost:3001');
});

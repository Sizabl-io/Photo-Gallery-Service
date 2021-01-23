require("newrelic");
const express = require("express");
const path = require("path");
const db = require("./dbs/postgres-db");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "/../public")));

/**
 * Select all restaurants matching restaurant ID
 */
app.get("/api/restaurants/:id", (req, res) => {
  const { id } = req.params;
  db.selectRestaurantByID(id, false, (err, data) => {
    res.status(200).send(data.rows[0]);
  });
});

/**
 * Select photos matching restaurant ID
 */
app.get("/api/galleries/:id", (req, res) => {
  const { id } = req.params;
  // console.log(id);
  db.selectPhotoByRestaurantID(id, false, (err, data) => {
    res.status(200).send({ gallery: data.rows });
  });
});

/**
 * Post a photo
 */
app.post("/api/photos/", (req, res) => {
  const photo = req.body;
  db.insertPhoto(photo, false, (err, data) => {
    console.log(`${data.command}ed a photo!`);
    res.sendStatus(201);
  });
});

/**
 * Delete a photo by photo id
 */
app.delete("/api/photos/:id", (req, res) => {
  const { id } = req.params;
  // console.log(id);
  db.deletePhotoByID(id, false, (err, data) => {
    // console.log(JSON.stringify(data))
    res.sendStatus(200);
  });
});

/**
 * Insert a user
 */
app.post("/api/users/", (req, res) => {
  const user = req.body;
  db.insertUser(user, false, (err, data) => {
    console.log(`${data.command}ed a user!`);
    res.sendStatus(201);
  });
});

/**
 * Get users matching user id
 */
app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.selectUserByID(id, false, (err, data) => {
    res.status(200).send({ users: data.rows });
  });
});

app.listen(3001, () => {
  console.log("listening on http://localhost:3001");
});

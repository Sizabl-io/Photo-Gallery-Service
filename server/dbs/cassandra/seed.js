const db = require('./db.js');
const { faker } = require('faker');

const seedAll = async () => {
  const res = await db.client.execute('select * from gallery.restaurants');
  console.log(res);
};

seedAll();
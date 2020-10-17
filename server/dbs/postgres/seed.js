const db = require('./db.js');
const { faker } = require('faker');

const seedAll = async () => {
  await db.connectToPool();
  await db.releasePool();
}

seedAll();
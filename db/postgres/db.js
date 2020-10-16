const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '#bns08231',
  database: 'gallery',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
});

// async/await - check out a client
const connectToPool = async () => {
  const client = await pool.connect();
  try {
    console.log('Connected to pool!');
    const res = await client.query('SELECT * FROM photos');
    console.log(res);
  } finally {
    // Make sure to release the client before any error handling,
    // just in case the error handling itself throws an error.
    client.release();
    console.log('Released the client');
  }
}

module.exports = {
  connectToPool,
}
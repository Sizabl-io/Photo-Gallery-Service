import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

export let restaurantTrend = new Trend('GET /api/restaurants Response Time (ms)');
export let restaurantErrorRate = new Rate('GET /api/restaurants Error Rate');

// ramp up/down the number of users
const stages1k = [
  { duration: "30s", target: 200 },
  { duration: "1m", target: 500 },
  { duration: "2m", target: 1000 },
  { duration: "1m", target: 500 },
  { duration: "30s", target: 200 },
];

const stages100 = [
  { duration: "30s", target: 20 },
  { duration: "1m", target: 50 },
  { duration: "2m", target: 100 },
  { duration: "1m", target: 50 },
  { duration: "30s", target: 20 },
];

const stages10 = [
  { duration: "30s", target: 2 },
  { duration: "1m", target: 5 },
  { duration: "2m", target: 10 },
  { duration: "1m", target: 5 },
  { duration: "30s", target: 2 },
];

const stages1 = [
  { duration: "30s", target: 1 },
];

export const options = {
  stages: stages1k,
}

export default function() {
  // GET a random gallery from the server
  const id = Math.ceil(Math.random() * 10000000);
  const urlRestaurants = `http://localhost:3001/api/restaurants/${id}`;

  const restaurantResp = http.get(urlRestaurants);

  check(restaurantResp, {
    'status is 200': r => r.status === 200
  }) || restaurantErrorRate.add(1);

  restaurantTrend.add(restaurantResp.timings.duration);

  sleep(1);
}
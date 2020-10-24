import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

export let galleryTrend = new Trend('GET /api/galleries Response Time (ms)');
export let galleryErrorRate = new Rate('GET /api/galleries Error Rate');

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
  stages: stages1,
}

export default function() {
  // GET a random gallery from the server
  const id = Math.ceil(Math.random() * 10000000);
  const urlGalleries = `http://localhost:3001/api/galleries/${id}`;

  const galleryResp = http.get(urlGalleries);

  check(galleryResp, {
    'status is 200': r => r.status === 200
  }) || galleryErrorRate.add(1);

  galleryTrend.add(galleryResp.timings.duration);

  sleep(1);
}
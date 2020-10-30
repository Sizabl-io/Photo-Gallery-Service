import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

export let photoTrend = new Trend('POST /api/photos Response Time (ms)');
export let photoErrorRate = new Rate('POST /api/photos Error Rate');

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
  // generate a random photo and POST it to the server
  const urlPhotos = 'http://localhost:3001/api/photos/';
  const photoDoc = {
    restaurant_id: Math.ceil(Math.random() * 10000000),
    user_id: Math.ceil(Math.random() * 1000),
    helpful_count: 100,
    not_helpful_count: 100,
    photo_url: `/food/${Math.ceil(Math.random() * 1000)}`,
    caption: 'Fine dining',
    upload_date: new Date().toLocaleString('en-US'),
  };

  const params = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const photoResp = http.post(urlPhotos, JSON.stringify(photoDoc), params);

  check(photoResp, {
    'status is 201': r => r.status == 201
  }) || photoErrorRate.add(1);

  photoTrend.add(photoResp.timings.duration);

  sleep(1);
}
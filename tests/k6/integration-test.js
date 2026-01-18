import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 5 }, // Ramp up to 5 users
    { duration: '1m', target: 5 },  // Stay at 5 users
    { duration: '10s', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
  },
};

export default function () {
  // Service URLs (Internal K8s DNS)
  // These names must match the Service names in infra/k8s/dev/
  const frontendUrl = 'http://frontend-service-dev';
  const matchingUrl = 'http://matching-service-dev:3000';
  const notificationUrl = 'http://notification-service-dev:3000';

  // 1. Check Frontend Availability
  const resFrontend = http.get(frontendUrl);
  check(resFrontend, {
    'frontend status is 200': (r) => r.status === 200,
  });

  // 2. Check Matching Service Availability (Root endpoint)
  const resMatching = http.get(matchingUrl);
  check(resMatching, {
    'matching service status is 200': (r) => r.status === 200,
    'matching service says Hello': (r) => r.body.includes('Hello'),
  });

  // 3. Check Notification Service Availability (Root endpoint)
  const resNotification = http.get(notificationUrl);
  check(resNotification, {
    'notification service status is 200': (r) => r.status === 200,
    'notification service says Hello': (r) => r.body.includes('Hello'),
  });

  sleep(1);
}

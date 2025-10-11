# Notification Service

This is a NestJS microservice for sending notifications using Resend.

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the root of the service with the following content:

```
RESEND_API_KEY=your_api_key
FROM_EMAIL=default@email.com
```

Replace `your_api_key` with your actual Resend API key.
Replace `default@email.com` with your default send_from email.

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Testing the service

To run the unit tests, use the following command:

```bash
npm run test
```

To run the end-to-end tests, use the following command:

```bash
npm run test:e2e
```

## API

### POST /notification/send-email

Sends an email.

**Request body:**

```json
{
  "to": "recipient@example.com",
  "subject": "Hello World",
  "html": "<p>This is a test email.</p>"
}
```

**Response:**

A JSON object with the response from the Resend API.
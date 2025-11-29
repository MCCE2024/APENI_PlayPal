/**
 * Jest setup file for notification-service tests.
 *
 * This file sets environment variables used by NotificationService so that
 * tests can instantiate the service without requiring real secrets.
 *
 * Note: These are safe, non-production placeholders. Do NOT use real secrets here.
 */

process.env.RESEND_API_KEY = process.env.RESEND_API_KEY || 're_test_key';
process.env.FROM_MAIL = process.env.FROM_MAIL || 'onboarding@resend.dev';
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

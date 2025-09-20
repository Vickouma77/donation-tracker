/**
 * @fileoverview Donation Tracker API Documentation
 * @version 1.0.0
 * @description RESTful API for managing non-profit donation projects
 */

/**
 * @typedef {Object} Project
 * @property {string} id - Unique identifier for the project
 * @property {string} title - Project title
 * @property {string} description - Project description
 * @property {number} goalAmount - Target donation amount
 * @property {number} currentAmount - Current donated amount
 */

/**
 * @typedef {Object} Donation
 * @property {string} id - Unique identifier for the donation
 * @property {string} projectId - ID of the project being donated to
 * @property {number} amount - Donation amount
 * @property {string} paymentGateway - Payment gateway used (optional)
 * @property {Date} createdAt - Timestamp of donation creation
 */

/**
 * @typedef {Object} CreateDonationRequest
 * @property {string} projectId - Required: UUID of the project
 * @property {number} amount - Required: Positive number > 0
 * @property {string} [paymentGateway] - Optional: Payment gateway identifier
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the request was successful
 * @property {string} [message] - Response message
 * @property {Object} [data] - Response data
 * @property {Array} [errors] - Validation errors (if any)
 */

/**
 * @typedef {Object} HealthResponse
 * @property {string} status - Service status ('OK')
 * @property {string} timestamp - ISO timestamp
 * @property {number} uptime - Server uptime in seconds
 * @property {string} environment - Current environment
 */

/**
 * DONATION TRACKER API
 *
 * Base URL: http://localhost:4000/api/v1
 *
 * Authentication: None required (public API)
 *
 * Rate Limiting: 100 requests per 15 minutes per IP
 */

/**
 * GET /health
 *
 * Health check endpoint for monitoring service availability.
 *
 * @returns {HealthResponse} Service health information
 *
 * @example
 * GET /api/v1/health
 *
 * Response:
 * {
 *   "status": "OK",
 *   "timestamp": "2025-09-20T19:00:00.000Z",
 *   "uptime": 3600,
 *   "environment": "development"
 * }
 */

/**
 * GET /projects
 *
 * Retrieve all donation projects with their current progress.
 *
 * @returns {ApiResponse} List of all projects
 *
 * @example
 * GET /api/v1/projects
 *
 * Response:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "1",
 *       "title": "Clean Water Initiative",
 *       "description": "Providing clean drinking water to rural communities",
 *       "goalAmount": 10000,
 *       "currentAmount": 2500
 *     }
 *   ]
 * }
 */

/**
 * GET /projects/:id
 *
 * Retrieve a specific project by its ID.
 *
 * @param {string} id - Project UUID
 * @returns {ApiResponse} Project data or error
 *
 * @example
 * GET /api/v1/projects/1
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "id": "1",
 *     "title": "Clean Water Initiative",
 *     "description": "Providing clean drinking water to rural communities",
 *     "goalAmount": 10000,
 *     "currentAmount": 2500
 *   }
 * }
 */

/**
 * POST /donate
 *
 * Create a new donation and update the project's current amount.
 *
 * @param {CreateDonationRequest} body - Donation data
 * @returns {ApiResponse} Donation and updated project data
 *
 * @example
 * POST /api/v1/donate
 * Content-Type: application/json
 *
 * {
 *   "projectId": "1",
 *   "amount": 100,
 *   "paymentGateway": "PayPal"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "donation": {
 *       "id": "uuid-generated",
 *       "projectId": "1",
 *       "amount": 100,
 *       "paymentGateway": "PayPal",
 *       "createdAt": "2025-09-20T19:00:00.000Z"
 *     },
 *     "project": {
 *       "id": "1",
 *       "title": "Clean Water Initiative",
 *       "description": "Providing clean drinking water to rural communities",
 *       "goalAmount": 10000,
 *       "currentAmount": 2600
 *     }
 *   }
 * }
 */

/**
 * ERROR RESPONSES
 *
 * Common error response format:
 * {
 *   "success": false,
 *   "message": "Error description",
 *   "errors": [...] // Validation errors (if applicable)
 * }
 *
 * HTTP Status Codes:
 * - 200: Success
 * - 201: Created
 * - 400: Bad Request (validation errors)
 * - 404: Not Found
 * - 429: Too Many Requests (rate limited)
 * - 500: Internal Server Error
 */

/**
 * RATE LIMITING
 *
 * - 100 requests per 15 minutes per IP address
 * - Applies to donation endpoints
 * - Headers included in response:
 *   - X-RateLimit-Limit: Maximum requests allowed
 *   - X-RateLimit-Remaining: Remaining requests
 *   - X-RateLimit-Reset: Time when limit resets
 */

/**
 * SECURITY FEATURES
 *
 * - Helmet.js for security headers
 * - CORS configuration
 * - Input validation and sanitization
 * - Request logging and monitoring
 * - Error message sanitization in production
 */

/**
 * DEVELOPMENT SETUP
 *
 * 1. Install dependencies: npm install
 * 2. Copy .env.example to .env and configure
 * 3. Start development server: npm run dev
 * 4. API available at: http://localhost:4000
 *
 * Environment Variables:
 * - PORT: Server port (default: 4000)
 * - NODE_ENV: Environment (development/production)
 * - LOG_LEVEL: Logging level (info/debug/error)
 * - CORS_ORIGIN: Allowed CORS origin
 * - RATE_LIMIT_WINDOW_MS: Rate limit window
 * - RATE_LIMIT_MAX: Max requests per window
 */
# Donation Tracker API

A production-ready, enterprise-grade RESTful API built with Express.js and TypeScript for managing non-profit donation projects.

## 🚀 Features

- **TypeScript**: Full type safety and better developer experience
- **MongoDB**: Robust NoSQL database with Mongoose ODM
- **Security**: Helmet.js, CORS, rate limiting, input validation
- **Logging**: Structured logging with Winston
- **Error Handling**: Comprehensive error handling and monitoring
- **API Documentation**: Complete JSDoc documentation
- **Health Checks**: Built-in health monitoring with database status
- **Docker Support**: Containerized deployment
- **Environment Configuration**: Flexible configuration management
- **Rate Limiting**: Protection against abuse
- **Async/Await**: Modern JavaScript patterns
- **Database Seeding**: Automated sample data population

## 📋 API Endpoints

### Base URL
```
http://localhost:4000/api/v1
```

### Projects
- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project by ID

### Donations
- `POST /donate` - Create a donation

### Health
- `GET /health` - Health check

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/Vickouma77/donation-tracker.git
cd donation-tracker

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

## ⚙️ Configuration

Create a `.env` file with the following variables:

```env
```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Logging
LOG_LEVEL=info

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# API Version
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/donation-tracker
```

### MongoDB Setup

#### Option 1: Local MongoDB
```bash
# Install MongoDB locally
# macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string and update `MONGODB_URI` in `.env`
```

## 🏃‍♂️ Running the Application

### Development
```bash
npm run dev
```

### Development with Auto-Seeding
```bash
npm run seed:dev  # Seeds database and starts dev server
```

### Production
```bash
npm run build
npm run start:prod
```

### Database Operations
```bash
# Seed database with sample data
npm run seed

# Clean and rebuild
npm run clean
npm run build
```

### Docker
```bash
# Build image
npm run docker:build

# Run container (with local MongoDB)
npm run docker:run
```

### Docker Compose (Recommended)
```bash
# Start both app and MongoDB
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f app
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run lint
```

## 📚 API Documentation

### Health Check
```bash
GET /api/v1/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2025-09-20T19:00:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

### Get All Projects
```bash
GET /api/v1/projects
```

### Get Project by ID
```bash
GET /api/v1/projects/{id}
```

### Create Donation
```bash
POST /api/v1/donate
Content-Type: application/json

{
  "projectId": "uuid",
  "amount": 100.00,
  "paymentGateway": "PayPal"
}
```

## 🏗️ Project Structure

```
donation-tracker/
├── src/
│   ├── config/          # Configuration management
│   ├── controllers/     # Request handlers
│   ├── docs/           # API documentation
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript definitions
│   ├── utils/          # Utility functions
│   └── index.ts        # Application entry point
├── logs/               # Application logs
├── dist/               # Compiled JavaScript
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose (optional)
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevents abuse (100 req/15min)
- **Input Validation**: Request sanitization
- **Error Sanitization**: No sensitive data leakage
- **Request Logging**: Audit trail

## 📊 Monitoring

- **Health Checks**: `/health` endpoint
- **Structured Logging**: Winston with multiple transports
- **Error Tracking**: Comprehensive error logging
- **Performance Monitoring**: Request/response logging

## 🚀 Deployment

### Environment Variables
Set the following in your production environment:

```env
NODE_ENV=production
PORT=4000
LOG_LEVEL=info
CORS_ORIGIN=https://your-frontend-domain.com
```

### Docker Deployment
```bash
# Build and run with Docker
docker build -t donation-tracker .
docker run -p 4000:4000 -e NODE_ENV=production donation-tracker
```

### PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start dist/index.js --name donation-tracker
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

ISC License - see LICENSE file for details.

## 🆘 Support

For support, please create an issue in the GitHub repository.

## 🔄 API Versioning

The API uses versioning in the URL path: `/api/v1/`

Future versions will be available at `/api/v2/`, etc.

3. Start the development server
   ```bash
   npm run dev
   ```

4. Build for production
   ```bash
   npm run build
   ```

5. Start the production server
   ```bash
   npm start
   ```

## Project Structure

```
donation-tracker/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   └── index.ts         # Entry point
├── package.json
└── tsconfig.json
```

## Frontend Integration

The API is designed to work with an Astro frontend that will:
- Display each project with a progress bar 
- Allow users to make donations to projects
- Calculate progress as (currentAmount / goalAmount) * 100
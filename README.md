# Donation Tracker API

A RESTful API built with Express and TypeScript for tracking donations to non-profit projects.

## Features

- Track multiple projects with donation goals
- Record donations to specific projects
- Track progress towards project funding goals
- Simple, easy-to-use API endpoints

## API Endpoints

### Projects

- `GET /projects` - Get all projects with their current donation status
- `GET /projects/:id` - Get a single project by ID

### Donations

- `POST /donate` - Add a donation to a project
  - Request body: 
    ```json
    {
      "projectId": "1",
      "amount": 100,
      "paymentGateway": "PayPal" // Optional
    }
    ```
  - Response: Updated project with the new donation details

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Vickouma77/donation-tracker.git
   cd donation-tracker
   ```

2. Install dependencies
   ```bash
   npm install
   ```

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
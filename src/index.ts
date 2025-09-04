import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import projectRoutes from './routes/project.routes.js';
import donationRoutes from './routes/donation.routes.js';

// Create Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/projects', projectRoutes);
app.use('/donate', donationRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Donation Tracker API');
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;

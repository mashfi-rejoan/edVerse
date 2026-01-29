import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/database';
import authRoutes from './routes/auth';
// Import shared modules routes
const sharedModulesRoutes = require('./routes/sharedModules.js');
// Import database schemas
const { Complaint, Library } = require('./database/schemas.js');

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

// Import all routes
const bloodDonationRoutes = require('./routes/bloodDonation.js');
const cafeteriaRoutes = require('./routes/cafeteria.js');
const chatbotRoutes = require('./routes/chatbot.js');
const notificationRoutes = require('./routes/notifications.js');
const analyticsRoutes = require('./routes/analytics.js');
const moderationRoutes = require('./routes/moderation.js');
const googleClassroomRoutes = require('./routes/googleClassroom.js');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shared', sharedModulesRoutes);
app.use('/api/blood-donation', bloodDonationRoutes);
app.use('/api/cafeteria', cafeteriaRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/google-classroom', googleClassroomRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Example usage of schemas
// This is a placeholder for future API integration
console.log('Schemas loaded:', { Complaint, Library });

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  // eslint-disable-next-line no-console
  console.error('Server error:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`✓ API running on http://localhost:${port}`);
});

server.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Server error:', err);
});

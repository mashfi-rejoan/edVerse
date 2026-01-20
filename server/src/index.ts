import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/database';
import authRoutes from './routes/auth';

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

// Routes
app.use('/api/auth', authRoutes);
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

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

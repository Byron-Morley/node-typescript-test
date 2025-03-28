import express, { Express, Request, Response } from 'express';
import { isDatabaseConnected } from './db/database';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Basic route for testing
app.get('/', (req: Request, res: Response) => {
  res.send('Twinkl TypeScript Test API');
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  const dbConnected = isDatabaseConnected();

  if (dbConnected) {
    res.status(200).json({
      status: 'ok',
      database: 'connected',
    });
  } else {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
    });
  }
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);

  // Check database connection on startup
  const dbConnected = isDatabaseConnected();
  console.log(`[database]: Connection status - ${dbConnected ? 'Connected' : 'Disconnected'}`);
});

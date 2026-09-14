import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './db/index.ts';
import routes from './routes/index.ts';
import { swaggerSpec } from './docs/swaggerOptions.ts';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', routes);

// Global error handler — must be defined AFTER all routes
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate value', field: err.keyValue });
  }

  res.status(500).json({ message: 'Something went wrong' });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

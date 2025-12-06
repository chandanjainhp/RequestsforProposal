import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';

import emailInbound from './src/routes/emailInbound.js';
import rfpRouter from './src/routes/rfp.router.js';
import rfpsRouter from './src/routes/rfps.router.js';
import comparisonRouter from './src/routes/comparison.router.js';
import vendorRouter from './src/routes/vendor.router.js';
import healthRouter from './src/routes/health.router.js';
import logger from './src/utils/logger.js';

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true
}));

// JSON parser with error handling
app.use(express.json());

// Error handler for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    logger.error(`[JSON PARSE ERROR] ${err.message}`);
    logger.error(`[JSON PARSE ERROR] URL: ${req.method} ${req.url}`);
    logger.error(`[JSON PARSE ERROR] Content-Type: ${req.headers['content-type']}`);
    return res.status(400).json({ 
      ok: false, 
      error: 'Invalid JSON in request body',
      details: err.message 
    });
  }
  next(err);
});

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'src', 'uploads');
app.use('/uploads', express.static(UPLOAD_DIR));

const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/rfp_prototype';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('Mongo connected'))
  .catch(err => logger.error('Mongo connection error', err));

app.use('/api/email', emailInbound);
app.use('/api/rfp', rfpRouter);
app.use('/api/rfps', rfpsRouter);
app.use('/api', comparisonRouter);
app.use('/api/vendors', vendorRouter);
app.use('/health', healthRouter);

app.get('/health', (req, res) => res.json({ ok: true }));

// Global error handler
process.on('uncaughtException', (err) => {
  logger.error(`[UNCAUGHT EXCEPTION] ${err.message}`);
  logger.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`[UNHANDLED REJECTION] ${reason}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`API listening on ${PORT}`));
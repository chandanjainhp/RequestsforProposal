import { Queue } from 'bullmq';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const parseQueue = new Queue('parseQueue', {
  connection: REDIS_URL
});

export default parseQueue;

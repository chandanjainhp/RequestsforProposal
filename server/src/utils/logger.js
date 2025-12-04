const level = process.env.LOG_LEVEL || 'info';
export default {
  info: (...args) => { if (['info','debug'].includes(level)) console.log('[INFO]', ...args); },
  debug: (...args) => { if (level === 'debug') console.log('[DEBUG]', ...args); },
  error: (...args) => console.error('[ERROR]', ...args)
};

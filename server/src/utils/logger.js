const level = process.env.LOG_LEVEL || 'info';
export default {
  info: (...args) => { if (['info','debug'].includes(level)) console.log('[INFO]', ...args); },
  debug: (...args) => { if (level === 'debug') console.log('[DEBUG]', ...args); },
  warn: (...args) => { if (['info','debug','warn'].includes(level)) console.log('[WARN]', ...args); },
  error: (...args) => console.error('[ERROR]', ...args)
};

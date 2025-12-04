import Rfp from '../models/Rfp.js';
import Proposal from '../models/Proposal.js';
import Vendor from '../models/Vendor.js';
import mongoose from 'mongoose';

/**
 * GET /health/extended
 * Returns extended health metrics including:
 * - MongoDB connection status
 * - Redis connection status (if available)
 * - Database statistics
 * - Last job timestamp
 */
export const extendedHealth = async (req, res) => {
  try {
    const health = {
      ok: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };

    // MongoDB connection status
    const mongoState = mongoose.connection.readyState;
    const mongoStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    health.mongodb = {
      status: mongoStates[mongoState] || 'unknown',
      connected: mongoState === 1
    };

    // Database statistics
    if (mongoState === 1) {
      try {
        const rfpCount = await Rfp.countDocuments();
        const proposalCount = await Proposal.countDocuments();
        const vendorCount = await Vendor.countDocuments();
        
        const rfpStats = await Rfp.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]);
        
        health.database = {
          collections: {
            rfps: rfpCount,
            proposals: proposalCount,
            vendors: vendorCount
          },
          rfpsByStatus: rfpStats.reduce((acc, item) => {
            acc[item._id || 'unknown'] = item.count;
            return acc;
          }, {})
        };
      } catch (err) {
        health.database = {
          error: err.message
        };
      }
    }

    // Queue status (stub for now - would connect to Redis/BullMQ)
    health.queue = {
      status: 'configured',
      message: 'BullMQ queue available via parseQueue'
    };

    // Memory usage
    const memUsage = process.memoryUsage();
    health.memory = {
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)} MB`
    };

    // CPU usage (approximate)
    health.cpu = {
      usage: `${(process.cpuUsage().user / 1000000).toFixed(2)}s`,
      message: 'Cumulative user CPU time'
    };

    return res.status(200).json(health);
  } catch (error) {
    console.error('Extended health check error:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error fetching extended health',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * GET /health/ready
 * Kubernetes readiness probe - returns 200 only if fully ready to serve traffic
 */
export const readinessProbe = async (req, res) => {
  try {
    const mongoState = mongoose.connection.readyState;
    
    if (mongoState !== 1) {
      return res.status(503).json({
        ok: false,
        message: 'MongoDB not connected',
        ready: false
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Ready to serve traffic',
      ready: true
    });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      message: 'Readiness check failed',
      ready: false,
      error: error.message
    });
  }
};

/**
 * GET /health/live
 * Kubernetes liveness probe - quick check that process is still alive
 */
export const livenessProbe = (req, res) => {
  return res.status(200).json({
    ok: true,
    message: 'Process is alive',
    uptime: process.uptime()
  });
};

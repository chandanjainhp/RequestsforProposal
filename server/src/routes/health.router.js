import express from 'express';
import { extendedHealth, readinessProbe, livenessProbe } from '../controllers/health.controller.js';

const router = express.Router();

// GET /health/extended - Full metrics dump
router.get('/extended', extendedHealth);

// GET /health/ready - Kubernetes readiness probe
router.get('/ready', readinessProbe);

// GET /health/live - Kubernetes liveness probe
router.get('/live', livenessProbe);

export default router;

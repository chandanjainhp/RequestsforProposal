import express from 'express';
import emailController from '../controllers/email.controller.js';

const router = express.Router();

// Simple JSON endpoint for testing email processing
router.post('/inbound', emailController.processInboundEmail);

export default router;

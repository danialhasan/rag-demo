import express from 'express';
import { processRagQuery } from '../controllers/ai.controller.js';

const aiRouter = express.Router();
aiRouter.post('/query', processRagQuery);

export { aiRouter }; 
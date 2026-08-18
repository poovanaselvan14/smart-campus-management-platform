import { Router } from 'express';
import { askAssistant } from '../controllers/assistant.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/chat', askAssistant);

export default router;

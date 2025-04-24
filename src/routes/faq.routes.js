import express from 'express';
import FAQController from '../controller/faq.controller.js';
import faqLogger from '../middleware/faq.middleware.js';

const faqRoute = express.Router();

faqRoute.use(faqLogger);

faqRoute.get('/', FAQController.getFAQs);

export default faqRoute;

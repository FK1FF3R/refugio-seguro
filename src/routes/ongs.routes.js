import express from 'express';
import ONGController from '../controller/ongs.controller.js';
import ongLogger from '../middleware/ongs.middleware.js';

const ongRoute = express.Router();

ongRoute.use(ongLogger);

ongRoute.get('/', ONGController.getONG);
ongRoute.post('/', ONGController.postONG);

export default ongRoute;

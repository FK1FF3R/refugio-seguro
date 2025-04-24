import express from 'express';
import ApoioJuridicoController from '../controller/apoioJuridico.controller.js';
import apoioJuridicoLogger from '../middleware/apoioJuridico.middleware.js';

const apoioJuridicoRoute = express.Router();

apoioJuridicoRoute.use(apoioJuridicoLogger);

apoioJuridicoRoute.get('/', ApoioJuridicoController.getApoioJuridico);
apoioJuridicoRoute.post('/', ApoioJuridicoController.postApoioJuridico);

export default apoioJuridicoRoute;

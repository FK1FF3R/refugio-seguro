import express from 'express';
import RecursosController from '../controller/recursos.controller.js';
import recursosLogger from '../middleware/recursos.middleware.js';

const recursosRoute = express.Router();

recursosRoute.use(recursosLogger);

recursosRoute.get('/', RecursosController.getRecursos);
recursosRoute.post('/', RecursosController.postRecursos);

export default recursosRoute;

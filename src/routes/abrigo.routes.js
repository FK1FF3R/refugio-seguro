import express from 'express';
import AbrigosController from '../controller/abrigo.controller.js';
import abrigoMiddleware from '../middleware/abrigo.middleware.js';

const abrigosRoute = express.Router();

abrigosRoute.use(abrigoMiddleware);

abrigosRoute.get('/', AbrigosController.getAbrigos);
abrigosRoute.post('/', AbrigosController.postAbrigo);

export default abrigosRoute;

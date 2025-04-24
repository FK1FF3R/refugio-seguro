import express from 'express';
import cors from 'cors';
import abrigosRoute from '../src/routes/abrigo.routes.js';
import apoioJuridicoRoute from '../src/routes/apoioJuridico.routes.js';
import recursosRoute from '../src/routes/recursos.routes.js';
import ongRoute from '../src/routes/ongs.routes.js';
import faqRoute from '../src/routes/faq.routes.js';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;

app.use('/abrigos', abrigosRoute);
app.use('/apoiojuridico', apoioJuridicoRoute);
app.use('/recursos', recursosRoute);
app.use('/ongs', ongRoute);
app.use('/faq', faqRoute);

app.listen(PORT, () => {
  console.log(`API Refúgio Seguro rodando em http://localhost:${PORT}`);
});
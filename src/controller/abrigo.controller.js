import { readFile, writeFile } from 'fs/promises';
import { Abrigo } from '../model/abrigo.model.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ABRIGOS_DATA = join(__dirname, '../data/abrigo.json');

const normalizeText = (text) => {
  if (!text) return '';
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
};

class AbrigosController {
  static async getAbrigos(req, res) {
    try {
      
      const data = await readFile(ABRIGOS_DATA, 'utf-8');
      let abrigos = JSON.parse(data).map(abrigo => new Abrigo(abrigo));
      
      console.log('Dados carregados: ' + abrigos.length + ' abrigos');
     
      const { estado, cidade, publico, tipo, capacidade} = req.query;
      
      abrigos = abrigos.filter(abrigo => {
        return (
          (!estado || normalizeText(abrigo.estado) === normalizeText(estado)) &&
          (!cidade || normalizeText(abrigo.cidade).includes(normalizeText(cidade))) &&
          (!publico || normalizeText(abrigo.publico).includes(normalizeText(publico))) &&
          (!tipo || normalizeText(abrigo.tipo) === normalizeText(tipo)) &&
          (!capacidade || abrigo.capacidade >= parseInt(capacidade))
        );
      });
      
      if (abrigos.length === 0) {
        return res.status(404).json({
          message: 'Nenhum abrigo encontrado com os filtros aplicados'
        });
      }
      
      res.json(abrigos);
    } catch (error) {
      console.error('Erro ao carregar abrigos:', error);
      res.status(500).json({
        error: 'Erro ao carregar abrigos',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  static async postAbrigo(req, res) {
    try {
      const { nome, publico, estado, tipo, capacidade } = req.body;
  
      if (!nome || !publico || !estado || !tipo || capacidade == null) {
        return res.status(400).json({
          error: 'Campos obrigatórios ausentes ou inválidos: nome, publico, estado, tipo, capacidade'
        });
      }
  
      const novoAbrigo = new Abrigo({ 
        ...req.body,
        id: uuidv4()
      });
  
      const data = await readFile(ABRIGOS_DATA, 'utf-8');
      const abrigos = JSON.parse(data);
      
      abrigos.push(novoAbrigo);
      await writeFile(ABRIGOS_DATA, JSON.stringify(abrigos, null, 2), 'utf-8');
      
      console.log('Novo abrigo adicionado:', novoAbrigo);
      
      res.status(201).json(novoAbrigo);
    } catch (error) {
      console.error('Erro ao adicionar abrigo:', error);
      res.status(500).json({ 
        error: 'Erro ao salvar abrigo'
      });
    }
  }
}

export default AbrigosController;

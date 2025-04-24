import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApoioJuridico } from '../model/apoioJuridico.model.js';
import { readFile, writeFile } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APOIO_JURIDICO_DATA = join(__dirname, '../data/apoioJuridico.json');

const normalizeText = (text) => {
  if (!text) return '';
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
};

class ApoioJuridicoController {
  static async getApoioJuridico(req, res) {
    try {

      const data = await readFile(APOIO_JURIDICO_DATA, 'utf-8');
      const parsedData = JSON.parse(data);

      if (!Array.isArray(parsedData)) {
        throw new Error('Formato inválido: o conteúdo do JSON não é um array');
      }

      console.log('Dados carregados:', parsedData.length, 'registros');

      const apoioJuridico = parsedData.map(item => new ApoioJuridico(item));

      const filteredData = ApoioJuridicoController.applyFilters(apoioJuridico, req.query);

      if (filteredData.length === 0) {
        return res.status(404).json({
          message: 'Nenhum serviço encontrado com os filtros aplicados'
        });
      }

      return res.json(filteredData);

    } catch (error) {
      console.error('Erro no ApoioJuridicoController:', error);

      return res.status(500).json({
        error: 'Erro interno ao processar a solicitação'
      });
    }
  }

  static applyFilters(data, query) {
    let result = [...data];

    if (query.estado) {
      const normalizedEstado = normalizeText(query.estado);
      result = result.filter(item =>
        normalizeText(item.estado) === normalizedEstado
      );
    }

    if (query.cidade) {
      const normalizedCidade = normalizeText(query.cidade);
      result = result.filter(item =>
        normalizeText(item.cidade) === normalizedCidade
      );
    }

    if (query.tipoServico) {
      const normalizedTipo = normalizeText(query.tipoServico);
      result = result.filter(item =>
        normalizeText(item.tipoServico).includes(normalizedTipo)
      );
    }

    if (query.disponivel) {
      const isAvailable = query.disponivel.toLowerCase() === 'true';
      result = result.filter(item => item.disponivel === isAvailable);
    }

    if (query.nome) {
      const normalizedNome = normalizeText(query.nome);
      result = result.filter(item =>
        normalizeText(item.nome).includes(normalizedNome)
      );
    }

    return result;
  }

  static async postApoioJuridico(req, res) {
    try {
      const newEntry = req.body;
  
      if (!newEntry || !newEntry.nome || !newEntry.estado || !newEntry.cidade || !newEntry.tipoServico) {
        return res.status(400).json({ message: 'Dados obrigatórios faltando (nome, estado, cidade, tipoServico).' });
      }
  
      const data = await readFile(APOIO_JURIDICO_DATA, 'utf-8');
      const parsedData = JSON.parse(data);
  
      if (!Array.isArray(parsedData)) {
        throw new Error('Formato inválido: o conteúdo do JSON não é um array');
      }
  
      const newId = uuidv4();
      
      const newRecord = {
        id: newId,
        ...newEntry,
        disponivel: newEntry.disponivel ?? true
      };
  
      parsedData.push(newRecord);
  
      await writeFile(APOIO_JURIDICO_DATA, JSON.stringify(parsedData, null, 2), 'utf-8');
  
      console.log('Novo registro adicionado:', newRecord);
  
      return res.status(201).json(newRecord);
    } catch (error) {
      console.error('Erro ao adicionar novo apoio jurídico:', error);
      return res.status(500).json({ message: 'Erro ao adicionar novo registro', error: error.message });
    }
  }
}

export default ApoioJuridicoController;
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ONG } from '../model/ongs.model.js';
import { readFile, writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ONGS_DATA = join(__dirname, '../data/ongs.json');

const normalizeText = (text) => {
  if (!text) return '';
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
};

class ONGController {
  static async getONG(req, res) {
    try {

      const data = await readFile(ONGS_DATA, 'utf-8');
      const parsedData = JSON.parse(data);

      if (!Array.isArray(parsedData)) {
        throw new Error('Formato inválido: o conteúdo do JSON não é um array');
      }

      console.log('Dados carregados:', parsedData.length, 'registros');

      const ongs = parsedData.map(item => new ONG(item));
      const filteredData = ONGController.applyFilters(ongs, req.query);

      if (filteredData.length === 0) {
        return res.status(404).json({
          message: 'Nenhuma ONG encontrada com os filtros aplicados',
        });
      }

      return res.json(filteredData);

    } catch (error) {
      console.error('Erro no ONGController:', error);

      return res.status(500).json({
        error: 'Erro interno ao processar a solicitação'
      });
    }
  }

  static applyFilters(data, query) {
    let result = [...data];

    if (query.nome) {
      const normalizedNome = normalizeText(query.nome);
      result = result.filter(item =>
        normalizeText(item.nome).includes(normalizedNome)
      );
    }

    if (query.areaAtuacao) {
      const normalizedArea = normalizeText(query.areaAtuacao);
      result = result.filter(item =>
        item.areaAtuacao.some(area => 
          normalizeText(area).includes(normalizedArea)
        )
      );
    }

    if (query.missao) {
      const normalizedMissao = normalizeText(query.missao);
      result = result.filter(item =>
        normalizeText(item.missao).includes(normalizedMissao)
      );
    }

    return result;
  }

  static async postONG(req, res) {
    try {
      const newEntry = req.body;
  
      if (!newEntry || !newEntry.nome || !newEntry.missao || !newEntry.areaAtuacao) {
        return res.status(400).json({ 
          message: 'Dados obrigatórios faltando (nome, missao, areaAtuacao)' 
        });
      }
  
      const data = await readFile(ONGS_DATA, 'utf-8');
      const parsedData = JSON.parse(data);
  
      if (!Array.isArray(parsedData)) {
        throw new Error('Formato inválido: o conteúdo do JSON não é um array');
      }

      const newRecord = {
        id: uuidv4(),
        nome: newEntry.nome,
        missao: newEntry.missao,
        contatos: newEntry.contatos || {
          telefone: '',
          email: ''
        },
        areaAtuacao: Array.isArray(newEntry.areaAtuacao) 
          ? newEntry.areaAtuacao 
          : [newEntry.areaAtuacao],
        redesSociais: newEntry.redesSociais || {
          site: '',
          facebook: '',
          instagram: ''
        }
      };
  
      parsedData.push(newRecord);
  
      await writeFile(ONGS_DATA, JSON.stringify(parsedData, null, 2), 'utf-8');
  
      console.log('ONG adicionada com sucesso:', newRecord);
  
      return res.status(201).json(newRecord);
    } catch (error) {
      console.error('Erro ao adicionar nova ONG:', error);
      return res.status(500).json({ 
        message: 'Erro ao adicionar novo registro', 
        error: error.message 
      });
    }
  }
}

export default ONGController;

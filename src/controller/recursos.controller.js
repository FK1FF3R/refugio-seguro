import { readFile, writeFile } from 'fs/promises';
import { Recurso } from '../model/recursos.model.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RECURSOS_DATA = join(__dirname, '../data/recursos.json');

const normalizeText = (text) => {
  if (!text) return '';
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
};

class RecursosController {
  static async getRecursos(req, res) {
    try {
      
      const data = await readFile(RECURSOS_DATA, 'utf-8');
      const recursos = JSON.parse(data).map(item => new Recurso(item));
      
      console.log('Dados carregados:', recursos.length, 'recursos');
      
      const { tipo, publicoAlvo, idioma, tag } = req.query;
      let filtrados = recursos;
      
      if (tipo) {
        const normalizedTipo = normalizeText(tipo);
        filtrados = filtrados.filter(recurso => 
          normalizeText(recurso.tipo) === normalizedTipo
        );
      }
      
      if (publicoAlvo) {
        const normalizedPublicoAlvo = normalizeText(publicoAlvo);
        filtrados = filtrados.filter(recurso =>
          normalizeText(recurso.publicoAlvo).includes(normalizedPublicoAlvo)
        );
      }
      
      if (idioma) {
        const normalizedIdioma = normalizeText(idioma);
        filtrados = filtrados.filter(recurso =>
          normalizeText(recurso.idioma).includes(normalizedIdioma)
        );
      }
      
      if (tag) {
        const normalizedTag = normalizeText(tag);
        filtrados = filtrados.filter(recurso =>
          recurso.tags?.some(t => normalizeText(t).includes(normalizedTag))
        );
      }

      if (filtrados.length === 0) {
        return res.status(404).json({
          message: 'Nenhum recurso encontrado com os filtros aplicados'
        });
      }
      
      res.json(filtrados);
    } catch (error) {
      console.error('Erro ao carregar recursos:', error);
      res.status(500).json({ 
        error: 'Erro ao carregar recursos' 
      });
    }
  }
  
  static async postRecursos(req, res) {
    try {
      const { titulo, url, tipo, descricao, publicoAlvo, idioma, tags } = req.body;
      
      if (!titulo || !url || !tipo) {
        return res.status(400).json({ error: 'Campos obrigatórios: titulo, url, tipo' });
      }
      
      const data = await readFile(RECURSOS_DATA, 'utf-8');
      const recursos = JSON.parse(data);
      
      const novoRecurso = {
        id: uuidv4(),
        titulo,
        url,
        tipo,
        descricao: descricao || '',
        publicoAlvo: publicoAlvo || '',
        idioma: idioma || 'Português',
        tags: tags || []
      };
      
      recursos.push(novoRecurso);
      await writeFile(RECURSOS_DATA, JSON.stringify(recursos, null, 2), 'utf-8');
      
      console.log('Novo recurso adicionado:', novoRecurso);
      
      res.status(201).json(novoRecurso);
    } catch (error) {
      console.error('Erro ao salvar recurso:', error);
      res.status(500).json({ 
        error: 'Erro ao salvar recurso'
      });
    }
  }
}

export default RecursosController;

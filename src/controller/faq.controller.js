import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FAQ_DATA = join(__dirname, '../data/faq.json');

class FAQController {
  static async getFAQs(req, res) {
    try {
      const data = await readFile(FAQ_DATA, 'utf-8');
      const faqs = JSON.parse(data);
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao carregar FAQs' });
    }
  }
}

export default FAQController;
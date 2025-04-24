import { v4 as uuidv4 } from 'uuid';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logFilePath = join(__dirname, '../logs/faq.logs.json');

const getBrasiliaTime = () => {
  const now = new Date();
  const offset = -3 * 60;
  const brasiliaTime = new Date(now.getTime() + offset * 60 * 1000);
  return brasiliaTime.toISOString();
};

const faqLogger = (req, res, next) => {
  const requestId = uuidv4();
  const timestamp = getBrasiliaTime(); 

  const logEntry = {
    requestId,
    timestamp,
    method: req.method,
    url: req.originalUrl,
    statusCode: null,
    query: req.query
  };

  res.on('finish', async () => {
    logEntry.statusCode = res.statusCode;

    try {
      let logs = [];

      try {
        const fileData = await readFile(logFilePath, 'utf-8');
        logs = JSON.parse(fileData || '[]');
      } catch {
        logs = [];
      }

      logs.push(logEntry);

      await writeFile(logFilePath, JSON.stringify(logs, null, 2), 'utf-8');

      console.log(`[LOG][FAQ] - [${timestamp}] - [${requestId}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
    } catch (error) {
      console.error('Erro ao registrar log de FAQ:', error);
    }
  });

  next();
};

export default faqLogger;
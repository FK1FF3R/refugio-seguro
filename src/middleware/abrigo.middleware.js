import { v4 as uuidv4 } from 'uuid';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logFilePath = join(__dirname, '../logs/abrigo.logs.json');

const getBrasiliaTime = () => {
  const now = new Date();
  now.setHours(now.getHours() - 3);
  return now.toISOString();
};

const abrigoMiddleware = (req, res, next) => {
  const requestId = uuidv4();
  const method = req.method;
  const url = req.originalUrl;
  const timestamp = getBrasiliaTime();

  const logEntry = {
    requestId,
    timestamp,
    method,
    url,
    statusCode: null,
  };

  res.on('finish', async () => {
    logEntry.statusCode = res.statusCode;

    try {
      let logs = [];

      try {
        const fileData = await readFile(logFilePath, 'utf-8');
        logs = JSON.parse(fileData || '[]');
      } catch (readError) {
        logs = [];
      }

      logs.push(logEntry);

      await writeFile(logFilePath, JSON.stringify(logs, null, 2), 'utf-8');

      console.log(`[Abrigo] - [${timestamp}] - [${requestId}] ${method} ${url} - Status: ${res.statusCode}`);
    } catch (error) {
      console.error('Erro ao salvar log no arquivo:', error);
    }
  });

  next();
};

export default abrigoMiddleware;
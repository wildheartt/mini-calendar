import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const adapter = new JSONFile(path.join(__dirname, 'db.json'));
const db = new Low(adapter, { tasks: [] });

const allowedOrigins = [
  'https://wildheartt.github.io',
  'https://mini-calendar-production.up.railway.app',
];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type',
  }),
);
app.options('/api/*', cors()); 

app.use(express.json());

app.get('/api/tasks', async (req, res) => {
  const { from, to } = req.query;
  await db.read();
  const tasks = db.data.tasks.filter((t) => t.date >= from && t.date <= to);
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const { date, text } = req.body;
  if (!date || !text) {
    return res.status(400).json({ error: 'Нужно указать date и text' });
  }
  await db.read();
  const newTask = { id: Date.now().toString(), date, text };
  db.data.tasks.push(newTask);
  await db.write();
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  await db.read();
  const task = db.data.tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: 'Не найдена задача' });
  task.text = text ?? task.text;
  await db.write();
  res.json(task);
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await db.read();
  db.data.tasks = db.data.tasks.filter((t) => t.id !== id);
  await db.write();
  res.status(204).end();
});

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

(async function start() {
  await db.read();
  db.data ||= { tasks: [] };
  await db.write();
  app.listen(PORT, () =>
    console.log(`Server ready →  http://localhost:${PORT}`),
  );
})();

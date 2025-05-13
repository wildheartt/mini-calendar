import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const app = express();
const PORT = process.env.PORT || 3000;

const adapter = new JSONFile('db.json');
const db = new Low(adapter, { tasks: [] });

app.use(cors());
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

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await db.read();
  db.data.tasks = db.data.tasks.filter((t) => t.id !== id);
  await db.write();
  res.status(204).end();
});

app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  await db.read();
  const task = db.data.tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: 'Не найдена задача' });
  task.text = text || task.text;
  await db.write();
  res.json(task);
});

async function start() {
  await db.read();
  db.data ||= { tasks: [] };
  await db.write();
  app.listen(PORT, () => {
    console.log(`API запущено на http://localhost:${PORT}`);
  });
}

start();

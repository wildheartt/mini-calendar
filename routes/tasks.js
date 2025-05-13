import { Router } from 'express';
const router = Router();

const tasks = [];
router.get('/', (req, res) => {
  res.json(tasks);
});

router.post('/', (req, res) => {
  const task = req.body;
  tasks.push(task);
  res.status(201).json(task);
});

export default router;

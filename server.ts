import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  runAutonomousTask,
  chatWithAgent,
  hireCustomEmployee,
} from './src/server/agentRunner';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'Team-Ai - AI Employees & Autonomous Coworkers Workplace',
    model: 'Gemini 3.7 Flash',
    timestamp: new Date().toISOString(),
  });
});

// Run an autonomous task with live steps & artifacts
app.post('/api/agent/run-task', async (req, res) => {
  try {
    const { agent, taskPrompt, memories } = req.body;
    if (!agent || !taskPrompt) {
      return res.status(400).json({ error: 'Agent et prompt de tâche requis.' });
    }

    const result = await runAutonomousTask(agent, taskPrompt, memories || []);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in /api/agent/run-task:', error);
    res.status(500).json({
      error: error?.message || "Erreur lors de l'exécution de la tâche par l'agent.",
    });
  }
});

// Conversational interaction with the AI Employee
app.post('/api/agent/chat', async (req, res) => {
  try {
    const { agent, message, history, memories } = req.body;
    if (!agent || !message) {
      return res.status(400).json({ error: 'Agent et message requis.' });
    }

    const response = await chatWithAgent(agent, message, history || [], memories || []);
    res.json({ success: true, data: response });
  } catch (error: any) {
    console.error('Error in /api/agent/chat:', error);
    res.status(500).json({
      error: error?.message || "Erreur de communication avec l'agent.",
    });
  }
});

// Hire custom employee via natural language description
app.post('/api/agent/hire-custom', async (req, res) => {
  try {
    const { promptDescription } = req.body;
    if (!promptDescription) {
      return res.status(400).json({ error: 'Description du poste requise.' });
    }

    const newEmployee = await hireCustomEmployee(promptDescription);
    res.json({ success: true, employee: newEmployee });
  } catch (error: any) {
    console.error('Error in /api/agent/hire-custom:', error);
    res.status(500).json({
      error: error?.message || "Erreur lors du recrutement de l'employé IA.",
    });
  }
});

async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Team-Ai Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

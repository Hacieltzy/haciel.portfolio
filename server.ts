import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import cors from 'cors';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('portfolio.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT,
    description TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    details TEXT,
    link TEXT,
    services TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    about TEXT,
    profilePic TEXT
  );

  INSERT OR IGNORE INTO settings (id, name) VALUES ('profile', 'Haciel');
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get('/api/projects', (req, res) => {
    try {
      const projects = db.prepare('SELECT * FROM projects ORDER BY createdAt DESC').all();
      // Parse services string back to array
      const parsedProjects = projects.map((p: any) => ({
        ...p,
        services: p.services ? JSON.parse(p.services) : []
      }));
      res.json(parsedProjects);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.post('/api/projects', (req, res) => {
    const { title, category, description, imageUrl, details, link, services } = req.body;
    try {
      const info = db.prepare(`
        INSERT INTO projects (title, category, description, imageUrl, details, link, services)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(title, category, description, imageUrl, details, link, JSON.stringify(services));
      res.json({ id: info.lastInsertRowid });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add project' });
    }
  });

  app.put('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    const { title, category, description, imageUrl, details, link, services } = req.body;
    try {
      db.prepare(`
        UPDATE projects 
        SET title = ?, category = ?, description = ?, imageUrl = ?, details = ?, link = ?, services = ?
        WHERE id = ?
      `).run(title, category, description, imageUrl, details, link, JSON.stringify(services), id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update project' });
    }
  });

  app.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    try {
      db.prepare('DELETE FROM projects WHERE id = ?').run(id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  app.get('/api/settings', (req, res) => {
    try {
      const settings = db.prepare('SELECT * FROM settings WHERE id = ?').get('profile');
      res.json(settings);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.post('/api/settings', (req, res) => {
    const { name, email, phone, location, about, profilePic } = req.body;
    try {
      db.prepare(`
        UPDATE settings 
        SET name = ?, email = ?, phone = ?, location = ?, about = ?, profilePic = ?
        WHERE id = 'profile'
      `).run(name, email, phone, location, about, profilePic);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

// pages/api/static/[...path].js

import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export default async function handler(req, res) {
  const { filename } = req.query;

  // Resolve the file path from the static_images directory
  const fullPath = path.resolve(`./public/static_images/${req.headers.host.replace(/^www\./, "")}`, filename);

  console.log("🚀 ~ handler ~ fullPath:", fullPath)
  try {
    // Check if the file exists
    if (fs.existsSync(fullPath)) {
      const file = fs.readFileSync(fullPath);
      const mimeType = mime.lookup(fullPath) || 'application/octet-stream';
      res.setHeader('Content-Type', mimeType);
      res.send(file);
    } else {
      res.status(404).send('File not found');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
}
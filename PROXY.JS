import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'https://wormhole.app',
  // Agrega otras URLs permitidas si lo deseas
];

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('Error: Falta parámetro ?url');

  const isAllowed = allowedOrigins.some(origin => targetUrl.startsWith(origin));
  if (!isAllowed) return res.status(403).send('Error: URL no permitida');

  try {
    const response = await fetch(targetUrl);
    let html = await response.text();

    // Opcional: insertar estilos o mensajes personalizados
    html = html.replace('</head>', '<style>body { font-family: Arial; }</style></head>');
    html = html.replace('</body>', '<div style="text-align:center;padding:10px;font-size:12px;color:#888">Cargado vía proxy</div></body>');

    res.set('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    res.status(500).send('Error al cargar el contenido: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy en ejecución en el puerto ${PORT}`);
});

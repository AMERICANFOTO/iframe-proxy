import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;

const TARGET = 'https://wormhole.app';
const allowedBaseUrl = TARGET;

app.use('/proxy', (req, res, next) => {
  const targetUrl = req.query.url || TARGET;
  if (!targetUrl.startsWith(allowedBaseUrl)) {
    return res.status(403).send('URL no permitida');
  }
  next();
});

app.use(
  '/proxy',
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    pathRewrite: {
      '^/proxy': '',
    },
    onError(err, req, res) {
      res.status(500).send('Error en proxy: ' + err.message);
    },
  })
);

app.listen(PORT, () => {
  console.log(`Proxy reverso ejecutándose en puerto ${PORT}`);
});

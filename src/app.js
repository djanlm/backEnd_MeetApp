import express from 'express';
import path from 'path';
import routes from './routes';

import './database'; // pega o index.js automaticamente

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes(); // funciona como middleware
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    ); // expres static serve pra mostrar arquivos como os de imagens.
  }

  routes() {
    // as rotas vem do arquivo routes.js
    this.server.use(routes);
  }
}

export default new App().server;

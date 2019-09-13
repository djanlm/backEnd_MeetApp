import express from 'express';
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
  }

  routes() {
    // as rotas vem do arquivo routes.js
    this.server.use(routes);
  }
}

export default new App().server;

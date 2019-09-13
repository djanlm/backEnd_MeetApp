// faz conexão com o banco de dados e importa os models
import Sequelize from 'sequelize';

// importa os models
import User from '../app/models/User';

import databaseConfig from '../config/database';

const models = [User]; // array com os models

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();

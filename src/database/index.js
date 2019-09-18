// faz conexão com o banco de dados e importa os models
import Sequelize from 'sequelize';

// importa os models
import User from '../app/models/User';
import File from '../app/models/File';
import Meetup from '../app/models/Meetup';

import databaseConfig from '../config/database';

const models = [User, File, Meetup]; // array com os models

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models)); // somente os models que possuem o método associate
  }
}

export default new Database();

import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs'; // usado pra criptografar a senha

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    // será executado antes de salvar
    this.addHook('beforeSave', async user => {
      // caso usuário tenha escrito o password
      if (user.password) {
        // criptografa a senha
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;

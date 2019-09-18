module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'admin',
  database: 'meetapp',
  define: {
    timestamps: true,
    underscored: true, // usa underscore em vez de camel case
    underscoredAll: true,
  },
};

module.exports = (sequelize, Sequelize) => {
  const Api = sequelize.define(
    'Api',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      type: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      api: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: ''
      }
    },
    {
      tableName: 'apis',
      freezeTableName: true,
      timestamps: true
    }
  );

  Api.migrate = async () => {
    // const count = await User.count();

    // if (!count) {
    await Api.destroy({ truncate: true });

    await Api.create({
      id: 1,
      api: 'wsaVL02X4vyjgU1DMatg'
    });
    await Api.create({
      id: 2,
      api: 'wsJ40TGsE4xf5ABWPy7Q'
    });
    await Api.create({
      id: 3,
      api: 'wsp44Clhx5d1HwD_WBCA'
    });
    // }
  };

  return Api;
};

const MD5 = require('md5.js');
const bcrypt = require('bcrypt');
// const company = require('./company');
const jwt = require('jsonwebtoken');
const secretKey = 'tradeSecretKey';

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      companyEmail: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'admin@gmail.com'
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      balance: {
        type: Sequelize.DOUBLE(20, 2),
        allowNull: true,
        defaultValue: 10000
      },
      equity: {
        type: Sequelize.DOUBLE(20, 2),
        allowNull: true,
        defaultValue: 10000
      },
      usedMargin: {
        type: Sequelize.DOUBLE(20, 2),
        allowNull: true,
        defaultValue: 0
      },
      allow: {
        type: Sequelize.ENUM('Allow', 'Block'),
        allowNull: true
      },
      totalProfit: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      },
      plan: {
        type: Sequelize.STRING,
        allowNull: true
      },
      drawdown: {
        type: Sequelize.STRING,
        allowNull: true
      },
      leverage: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // usertype: {
      //     type: Sequelize.STRING,
      //     allowNull: true,
      // },
      type: {
        // type: Sequelize.ENUM("Demo", "Live"),
        type: Sequelize.STRING,
        allowNull: true
      }
    },
    {
      tableName: 'users',
      freezeTableName: true,
      timestamps: true
    }
  );

  User.migrate = async () => {
    await User.destroy({ truncate: true });
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('123456', saltRounds);

    await User.create({
      email: 'test@gmail.com',
      name: 'Admin',
      companyEmail: 'admin@gmail.com',
      password: hashedPassword,
      allow: 'Allow',
      type: 'Demo',
      token: jwt.sign({ hashedPassword, type: 'Demo' }, secretKey)
    });

    await User.create({
      email: 'test@gmail.com',
      name: 'Admin',
      companyEmail: 'admin@gmail.com',
      password: hashedPassword,
      allow: 'Allow',
      type: 'Live',
      token: jwt.sign({ hashedPassword, type: 'Live' }, secretKey)
    });
  };

  return User;
};

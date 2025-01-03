const MD5 = require("md5.js");
const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
  const Formula = sequelize.define(
    "Formula",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      formula: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pip_size: {
        type: Sequelize.DOUBLE(20, 6),
        allowNull: false,
      },
      assetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "assets", // Table name for Assets
          key: "id", // Primary key in Assets
        },
      },
    },
    {
      tableName: "formula",
      freezeTableName: true,
      timestamps: true,
    }
  );

  // Define relationships
  Formula.associate = (models) => {
    Formula.belongsTo(models.Assets, { foreignKey: "assetId", as: "assets" });
  };

  // Migration function
  Formula.migrate = async () => {
    await Formula.destroy({ truncate: true });

    await Formula.create({
      name: "Any pair/USD",
      formula: "1",
      pip_size: 0.0001,
      assetId: 1
    });
    await Formula.create({
      name: "USD/any pair",
      formula: "2",
      pip_size: 0.0001,
      assetId: 1

    });
    await Formula.create({
      name: "USD/JPY",
      formula: "3",
      pip_size: 0.01,
      assetId: 1

    });
    await Formula.create({
      name: "JPY/Any pair converted to USD",
      formula: "4",
      pip_size: 0.01,
      assetId: 1

    });
    await Formula.create({
      name: "Any/Any converted to USD",
      formula: "5",
      pip_size: 0.0001,
      assetId: 2

    });
    await Formula.create({
      name: "Indices",
      formula: "6",
      pip_size: 0.1,
      assetId: 2

    });
    await Formula.create({
      name: "Crypto/USD",
      formula: "7",
      pip_size: 0.01,
      assetId: 3
    });
    await Formula.create({
      name: "Crypto/Crypto converted to USD",
      formula: "8",
      pip_size: 0.01,
      assetId: 3
    });
    await Formula.create({
      name: "Metals to USD",
      formula: "9",
      pip_size: 0.01,
      assetId: 4
    });
  };

  return Formula;
};

const MD5 = require('md5.js');
const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
    const Companyuser = sequelize.define(
        "Companyuser",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            url: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            api_key: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            
            end_point: {
                type: Sequelize.STRING,
                allowNull: true,
                default:"http://localhost:3000"
            },
            // password: {
            //     type: Sequelize.STRING,
            //     allowNull: false,
            // },
            // token: {
            //     type: Sequelize.STRING,
            //     allowNull: true,
            // },
            // role: {
            //     type: Sequelize.ENUM("Admin", "Company"),
            //     allowNull: false,
            // },
        },
        {
            tableName: "company_user",
            freezeTableName: true,
            timestamps: true,
        }
    );

    Companyuser.migrate = async () => {
       // const count = await Company.count();

        // if (!count) {
            // await Company.destroy({ truncate: true });
            // const saltRounds = 10;
            // const hashedPassword = await bcrypt.hash("123456", saltRounds);
            // createdAt = Date

            await Companyuser.create({
                email: "admin@gmail.com",
                name: "My Company",
                url: "google.com",
            })
    }

    return Companyuser;
}
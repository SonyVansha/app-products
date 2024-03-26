const { Sequelize, DataTypes } = require("/opt/node_modules/sequelize");
const { getParameter } = require("./service");

const initDatabase = async () => {
try {
    console.log("Trying connect to database...");

    const dbConfig = {
        dbname: "data_db",
        username: "postgres",
        password: "adminsony",
        endpoint: "test-database-product.cvoywy8is1t9.us-east-1.rds.amazonaws.com"
    };
    
    const sequelize = new Sequelize(dbConfig.dbname, dbConfig.username, dbConfig.password, {
        host: dbConfig.endpoint,
        dialect: "postgres",
        dialectOptions: {
            ssl: true
        }
    });

    await sequelize.authenticate();
    console.log("Database connection established");

    // Event table Schema
    const Event = sequelize.define(
        "tbl_products",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                unique: true,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            freezeTableName: true,
            timestamps: true,
        }
    );



    console.log("Sync database model...");
    await sequelize.sync();
    console.log("Database connection established and models synchronized.");

    return { sequelize, Event };
    } catch (error) {
        console.error("Error during database initialization:", error);
        throw error;
    }
};

module.exports = { initDatabase };

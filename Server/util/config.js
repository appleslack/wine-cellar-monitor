const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    DB_USER   : process.env.DB_USER,
    DB_PASS   : process.env.DB_PASS,
    DB_CLUSTER: process.env.DB_CLUSTER,
    PORT      : process.env.PORT,
    
    TESTING_MODE : process.env.TESTING_MODE
};

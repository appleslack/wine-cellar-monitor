const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const serverConfig= require('./config');

let _db;

const mongoConnect = (callback) => {
    const connString = `mongodb+srv://${serverConfig.DB_USER}:${serverConfig.DB_PASS}@${serverConfig.DB_CLUSTER}-qtham.mongodb.net/wine-cellar-monitor`;
    console.log('Attempting to connect to: ', connString);
    
    MongoClient.connect(connString)
    .then(client => {
        console.log('Connected to database');
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
};

const getDatabase = () => {
    if( _db ) {
        return _db;
    }
    return undefined;
}

exports.mongoConnect = mongoConnect;
exports.getDatabase = getDatabase;


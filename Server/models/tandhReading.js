
const getDatabase = require( '../util/database').getDatabase;
const serverConfig = require('../util/config');

class Reading {
    constructor( it, ot, ih, oh, timestamp, id) {
        this.insideTemp = it;
        this.outsideTemp = ot;
        this.insideHumitidy = ih;
        this.outsideHumitidy = oh;
        this.timestamp = timestamp;
        this._id = id;
    }
    
    save() {
        // This is only needed in testing mode
        const db = getDatabase();
        let dbOp;

        dbOp = db.collection('readings').insertOne(this)
        return dbOp
            .then(result => {
                console.log(result, ' Inserted a reading into the database');
            })
            .catch(err => {
                console.log('Error inserting into databaes: ', err);
            })
    }
}

module.exports = Reading;

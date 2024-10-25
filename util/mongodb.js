const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const client = new MongoClient('mongodb+srv://erickmwarama:mutwiriEM1992@max-nodejs-cluster.s8ko4.mongodb.net/?retryWrites=true&w=majority&appName=max-nodejs-cluster');
let _db;

const mongoConnect = async () => {
    try {
        const result = await client.connect();
        console.log('connected');
        _db = result.db('shop');
    } catch (error) {
        console.log(error);
    }
}

const getDb = () => {
    if (_db) {
        return _db;
    }

    throw new Error('DB connection not found');
}

module.exports = {mongoConnect, getDb};

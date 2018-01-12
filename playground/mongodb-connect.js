// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

// const obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/todo', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    // db.collection('todos')
    //     .insertOne({
    //         text: 'Something to do',
    //         completed: false
    //     })
    //     .then((result) => {
    //         console.log(JSON.stringify(result.ops, undefined, 2));
    //     })
    //     .catch((err) => {
    //         console.log('Unable to insert record', err);
    //     });

    // db.collection('user')
    //     .insertOne({
    //         name: 'Maximiliano',
    //         age: 29,
    //         location: 'Buenos Aires'
    //     })
    //     .then((result) => {
    //         console.log(JSON.stringify(result.ops, undefined, 2));
    //         console.log(result.ops[0]._id.getTimestamp());
    //     })
    //     .catch((err) => {
    //         console.log('Unable to insert record', err);
    //     });

    db.close();
});

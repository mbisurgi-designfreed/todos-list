const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todo', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    // db.collection('todos')
    //     .find({
    //         _id: new ObjectID('5a580488353eb712e991d8bf')
    //     })
    //     .toArray()
    //     .then((documents) => {
    //         console.log('Todos');
    //         console.log(JSON.stringify(documents, undefined, 2));
    //     })
    //     .catch((err) => {
    //         console.log('Unable to get todos', err);
    //     });

    // db.collection('todos')
    //     .find({})
    //     .count()
    //     .then((count) => {
    //         console.log('Todos Count:', count);
    //     })
    //     .catch((err) => {
    //         console.log('Unable to get todos', err);
    //     });

    db.collection('user')
        .find({ name: 'Matias' })
        .toArray()
        .then((documents) => {
            console.log('Users');
            console.log(JSON.stringify(documents, undefined, 2));
        })
        .catch((err) => {
            console.log('Unable to get todos', err);
        });

    db.close();
});
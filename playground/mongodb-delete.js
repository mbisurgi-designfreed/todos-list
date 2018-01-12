const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todo', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    // deleteMany
    // db.collection('todos')
    //     .deleteMany({text: 'Make dinner'})
    //     .then((result) => {
    //         console.log(result.result);
    //     })
    //     .catch((err) => {
    //         console.log('Unable to get todos', err);
    //     });
    // deleteOne
    // db.collection('todos')
    //     .deleteOne({text: 'Play a game'})
    //     .then((result) => {
    //         console.log(result.result);
    //     })
    //     .catch((err) => {
    //         console.log('Unable to get todos', err);
    //     });

    // findOneAndDelete
    // db.collection('todos')
    //     .findOneAndDelete({text: 'Play a game'})
    //     .then((document) => {
    //         console.log(document);
    //     })
    //     .catch((err) => {
    //         console.log('Unable to get todos', err);
    //     });

    // db.collection('user')
    //     .deleteMany({name: 'Matias'})
    //     .then((result) => {
    //         console.log(result.result);
    //     })
    //     .catch((err) => {
    //         console.log('Unable to get todos', err);
    //     });

    db.collection('user')
        .findOneAndDelete({ _id: new ObjectID('5a5807c3353eb712e991d8c1') })
        .then((document) => {
            console.log(document);
        })
        .catch((err) => {
            console.log('Unable to get todos', err);
        })

    db.close();
});
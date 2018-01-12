const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todo', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    // db.collection('todos')
    //     .findOneAndUpdate({
    //         _id: new ObjectID('5a580488353eb712e991d8bf')
    //     }, {
    //         $set: { completed: true }
    //     }, {
    //         returnOriginal: false
    //     })
    //     .then((result) => {
    //         console.log(result);
    //     })
    //     .catch((err) => {
    //         console.log('Unable to get todos', err);
    //     });

    db.collection('user')
        .findOneAndUpdate({
            _id: new ObjectID('5a5807f5353eb712e991d8c3')
        }, {
            $set: {
                name: 'Maximiliano'
            },
            $inc: {
                age: 1
            }
        }, {
            returnOriginal: false
        })
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log('Unable to get todos', err);
        });

    db.close();
});
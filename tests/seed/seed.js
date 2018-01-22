const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');

const Todo = require('../../server/models/todo.model');
const User = require('../../server/models/user.model');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 1000
}];

const populateTodos = (done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos);
        })
        .then(() => done());
};

const user1Id = new ObjectID();
const user2Id = new ObjectID();

const users = [{
    _id: user1Id,
    email: 'mbisurgi@bc-group.com.ar',
    password: 'user1abc',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: user1Id, access: 'auth'}, 'somesecret').toString()
    }]
}, {
    _id: user2Id,
    email: 'maximiliano@designfreed.com',
    password: 'user2abc'
}];

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            const user1 = new User(users[0]).save();
            const user2 = new User(users[1]).save();

            return Promise.all([user1, user2]);
        })
        .then((result) => done())
        .catch((err) => {
            console.log(err);
            done();
        });
};

module.exports = { todos, populateTodos, users, populateUsers };
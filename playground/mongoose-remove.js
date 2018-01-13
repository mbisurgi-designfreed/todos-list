const { ObjectID } = require('mongodb');

const mongoose = require('../server/db/mongoose');
const Todo = require('../server/models/todo.model');
const User = require('../server/models/user.model');

// Todo.remove({})
//     .then((result) => {
//         console.log(result);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// Todo.findOneAndRemove({})
//     .then((todo) => {

//     })
//     .catch((err) => {

//     });

Todo.findByIdAndRemove('5a599bd8353eb712e991d8cc')
    .then((todo) => {
        console.log(todo);
    })
    .catch((err) => {
        console.log(todo);
    });
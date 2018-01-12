const { ObjectID } = require('mongodb');

const mongoose = require('../server/db/mongoose');
const Todo = require('../server/models/todo.model');
const User = require('../server/models/user.model');

// const id = '5a5942508c1d21ad626c0eeb';

// if(!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos:', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo:', todo);
// });

// Todo.findById(id)
//     .then((todo) => {
//         if (!todo) {
//             return console.log('Id not found');
//         }

//         console.log('Todo by Id:', todo);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// const user1 = new User({
//     email: 'mbisurgi@bc-group.com.ar'
// });

// const user2 = new User({
//     email: 'cbisurgi@bc-group.com.ar'
// });

// user1.save()
//     .then(() => {

//     });

// user2.save()
//     .then(() => {

//     });

const id = '5a59466f2878d4b3679caa37';

if (ObjectID.isValid(id)) {
    User.findById(id)
        .then((user) => {
            if (!user) {
                return console.log('User not found');
            } 

            console.log('User:', user);
        })
} else {
    console.log('ID not valid');
};



const express = require('express');
const parser = require('body-parser');

const mongoose = require('./db/mongoose');
const Todo = require('./models/todo.model');
const User = require('./models/user.model');

const app = express();

app.use(parser.json());

app.get('/todos', (req, res) => {
    Todo.find({})
        .then((todos) => {
            res.status(200).send(todos);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

app.post('/todos', (req, res) => {
    const newTodo = new Todo({
        text: req.body.text
    })

    newTodo
        .save()
        .then((todo) => {
            res.status(200).send(todo);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server started, listening on port ${PORT}`);
});

module.exports = app;
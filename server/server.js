const express = require('express');
const parser = require('body-parser');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

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

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id)
        .then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }

            res.status(200).send(todo);
        })
        .catch((err) => {
            res.status(400).send();
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

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    const todo = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(todo.completed) && todo.completed) {
        todo.completedAt = new Date().getTime();
    } else {
        todo.completed = false;
        todo.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: todo }, { new: true })
        .then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }

            res.status(200).send(todo);
        })
        .catch((err) => {
            res.status(400).send();
        });
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id)
        .then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }

            res.status(200).send(todo);
        })
        .catch((err) => {
            res.status(400).send();
        });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server started, listening on port ${PORT}`);
});

module.exports = app;
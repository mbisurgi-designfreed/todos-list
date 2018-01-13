const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const app = require('../server/server');
const Todo = require('../server/models/todo.model');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 1000
}];

beforeEach((done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos);
        })
        .then(() => done());
});

describe('GET /todos/:id', () => {
    it('should return a todo', (done) => {
        const id = todos[0]._id.toHexString();

        request(app)
            .get(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        const id = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if id is not valid', (done) => {
        const id = '5a598b22fd0a96e876cadb921';

        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBe(2);
            })
            .end(done);
    });
});

describe('POST /todos', () => {
    it('should add a new todo', (done) => {
        const text = 'Food the cat';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ text })
                    .then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });

    it('should not add a new todo if not valid values', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done();
                }

                Todo.find({})
                    .then((todos) => {
                        expect(todos.length).toBe(2);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });
});

describe('PATCH /todos/:id', () => {
    it('should update a todo', (done) => {
        const id = todos[0]._id.toHexString();

        request(app)
            .patch(`/todos/${id}`)
            .send({ text: 'Todo updated', completed: true })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe('Todo updated');
                expect(res.body.completed).toBe(true);
                expect(res.body.completedAt).toExist().toBeA('number');
            })
            .end(done);
    });

    it('should update a todo to not completed and clear completedAt', (done) => {
        const id = todos[1]._id.toHexString();

        request(app)
            .patch(`/todos/${id}`)
            .send({completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.completed).toBe(false);
                expect(res.body.completedAt).toNotExist();
            })
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo ', (done) => {
        const id = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(id);
            })
            .end((err, res) => {
                if (err) {
                    return done();
                }

                Todo.findById(id)
                    .then((todo) => {
                        expect(todo).toNotExist();
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });

    it('should return 404 if todo not found', (done) => {
        const id = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if id is not valid', (done) => {
        const id = '5a598b22fd0a96e876cadb921';

        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
});


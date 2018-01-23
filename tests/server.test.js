const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const app = require('../server/server');
const Todo = require('../server/models/todo.model');
const User = require('../server/models/user.model');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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
            .send({ completed: false })
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

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
})

describe('POST /users', () => {
    it('should create a user', (done) => {
        const email = 'bisurgi@bc-group.com.ar';
        const password = 'maximati12';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end(done);
    });

    it('should return validation errors if request invalid', (done) => {
        const email = 'bisurgi@bc-group.com.ar';
        const password = 'maxi';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .expect((res) => {
                expect(res.body.errors).toExist();
            })
            .end(done);
    });

    it('should not create user if email in use', (done) => {
        const email = 'mbisurgi@bc-group.com.ar';
        const password = 'maximati12';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .expect((res) => {
                expect(res.body.errmsg).toExist();
            })
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({ email: users[1].email, password: users[1].password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id)
                    .then((user) => {
                        expect(user.tokens[0]).toInclude({
                            access: 'auth',
                            token: res.headers['x-auth']
                        });

                        done()
                    })
                    .catch((err) => {
                        done(err);
                    })
            });
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({ email: users[1].email, password: 'maximati12' })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id)
                    .then((user) => {
                        expect(user.tokens.length).toBe(0);

                        done()
                    })
                    .catch((err) => {
                        done(err);
                    })
            });
    });
});


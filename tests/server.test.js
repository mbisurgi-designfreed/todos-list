const expect = require('expect');
const request = require('supertest');

const app = require('../server/server');
const Todo = require('../server/models/todo.model');

beforeEach((done) => {
    Todo.remove({})
        .then(() => done());
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

                Todo.find({})
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
                        expect(todos.length).toBe(0);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });
});
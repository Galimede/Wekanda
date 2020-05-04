const chai = require('chai');
const should = require('chai').should();
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);

describe('Quizzes', () => {
    describe('GET /quizzes', () => {
        it('should return an array of all the quizzes', (done) => {
            chai
            .request(app)
            .get("/quizzes")
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
            });
            done();
        });
    });
    describe('GET /quizzes/:id', () => {
        it('should return 404 with an id not existing', (done) => {
            chai
            .request(app)
            .get("/quizzes/9999")
            .end((err,res) => {
                res.should.have.status(404);
            });
            done();
        });
        it('should return 500 with an input who is not a number', (done) => {
            chai
            .request(app)
            .get("/quizzes/toto")
            .end((err,res) => {
                res.should.have.status(500);
            });
            done();
        });
        it('should return 200 with an existring entry (/1)', (done) => {
            chai.request(app)
            .get("/quizzes/1")
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id_creator');
                res.body.should.have.property('id_quizz');
                res.body.should.have.property('title');
                res.body.should.have.property('path_file');
                res.body.should.have.property('difficulty');
            });
            done();
        });
    });
    describe('GET /withtags', () => {
        it('should return 200 and all quizzes with their tags', (done) => {
            chai
            .request(app)
            .get('/quizzes/withtags')
            .end((err,response) => {
                // console.log(res);
                response.should.have.status(200);
                response.body.forEach(res => {
                    res.should.be.a('object');
                    res.should.have.property('id_creator');
                    res.should.have.property('id_quizz');
                    res.should.have.property('title');
                    res.should.have.property('path_file');
                    res.should.have.property('difficulty');
                    res.should.have.property('tags');
                });
            });
            done();
        });
    });
    describe('GET /withtags/:tag', () => {
        it('should return 404 if the tag does not exist or not given properly', (done) => {
            chai
            .request(app)
            .get('/quizzes/withtags/errortag')
            .end((err,res) => {
                res.should.have.status(404);
            });
            done();
        });
        it('should return 200 and all quizzes for the given tag', (done) => {
            chai
            .request(app)
            .get('/quizzes/withtags/Animaux')
            .end((err,response) => {
                response.should.have.status(200);
                response.body.forEach(res => {
                    res.should.be.a('object');
                    res.should.have.property('id_creator');
                    res.should.have.property('id_quizz');
                    res.should.have.property('title');
                    res.should.have.property('path_file');
                    res.should.have.property('difficulty');
                    res.should.have.property('tags');
                });
            });
            done();
        });
    });
    describe('GET /:id/fromuser', () => {
        it('should return 404 if a user has not created any quizz', (done) => {
            chai
            .request(app)
            .get('/quizzes/5/fromuser')
            .end((err,res) => {
                res.should.have.status(404);
            });
            done();
        });
        it('should return 404 if a user does not exist or the input is wrong', (done) => {
            chai
            .request(app)
            .get('/quizzes/1024/fromuser')
            .end((err,res) => {
                res.should.have.status(404);
            });
            done();
        });
        it('should return 200 and the quizzes created if a user has created one nor some', (done) => {
            chai
            .request(app)
            .get('/quizzes/1/fromuser')
            .end((err,response) => {
                response.should.have.status(200);
                response.body.forEach(res => {
                    res.should.be.a('object');
                    res.should.have.property('id_creator');
                    res.should.have.property('id_quizz');
                    res.should.have.property('title');
                    res.should.have.property('path_file');
                    res.should.have.property('difficulty');
                });
            });
            done();
        });
    });
    describe('GET /:id/questions', () => {
        it('should return 404 if the quizz does not exist', (done) => {
            chai
            .request(app)
            .get('/quizzes/1024/questions')
            .end((err,res) => {
                res.should.have.status(404);
            });
            done();
        });
        it('should return 200 and the questions if the quizz exists', (done) => {
            chai
            .request(app)
            .get('/quizzes/1/questions')
            .end((err,response) => {
                response.should.have.status(200);
                response.body.forEach(res => {
                    res.should.be.a('object');
                    res.should.have.property('id_question');
                    res.should.have.property('id_quizz');
                    res.should.have.property('id_quizz').equal(1);
                    res.should.have.property('question');
                    res.should.have.property('path_file');
                });
            });
            done();
        });
    });
});
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const { app, startServer, closeServer } = require('../server');

describe('Todos API', () => {
  let server;

  before(async () => {
    server = await startServer();
    console.log('Server is running on port 3000');
  });

  after(async () => {
    if (server) {
      await closeServer(server);
      console.log('Server stopped');
    }
  });

  describe('GET /todos', () => {
    it('should return all todos', (done) => {
      chai.request(server)
        .get('/todos')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('POST /todos', () => {
    it('should create a new todo', (done) => {
      const todo = {
        title: 'Test Todo'
      };

      chai.request(server)
        .post('/todos')
        .send(todo)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('success');
          done();
        });
    });
  });

  // ... more tests for other routes (PUT, DELETE, etc.) ...
});

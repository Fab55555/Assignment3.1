const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const MONGODB_URI = 'mongodb://localhost/todos';

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  }
});

const Todo = mongoose.model('Todo', todoSchema);

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    const server = app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

async function closeServer(server) {
  try {
    await mongoose.connection.close();
    await server.close();
    console.log('Server closed');
  } catch (error) {
    console.error('Failed to close server:', error);
    process.exit(1);
  }
}

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const { title } = req.body;
    const todo = new Todo({
      title
    });
    await todo.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Failed to create todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

module.exports = {
  app,
  startServer,
  closeServer
};

const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const findUser = users.find((user) => user.username === username);
  if (!findUser) {
    return response.status(400).json({ error: "User not found" });
  }

  request.user = findUser;

  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  try {
    const { name, username } = request.body;

    const newUser = {
      id: uuidv4(),
      name,
      username,
      todos: [],
    };

    const usernameAlreadyExists = users.find(
      (user) => user.username === username
    );
    if (!usernameAlreadyExists) {
      users.push(newUser);
      return response.status(201).json(newUser);
    }

    return response.status(400).json({ error: "Username already exists" });
  } catch (error) {
    console.log(error);
    return response
      .status(400)
      .json({ error: "Unexpected error while creating new user" });
  }
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  try {
    const user = request.user;

    return response.status(200).json(user.todos);
  } catch (error) {
    console.log(error);
    return response
      .status(400)
      .json({ error: "Unexpected error while getting todos" });
  }
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  try {
    const { title, deadline } = request.body;
    const user = request.user;

    const newTodo = {
      id: uuidv4(),
      title,
      done: false,
      deadline: new Date(deadline),
      created_at: new Date(),
    };

    user.todos.push(newTodo);

    return response.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    return response
      .status(400)
      .json({ error: "Unexpected error while creating new Todo" });
  }
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  try {
    const user = request.user;
    const { title, deadline } = request.body;
    const { id } = request.params;

    const findTodo = user.todos.find((todo) => todo.id === id);

    if (!findTodo) {
      return response.status(404).json({ error: "Todo not found" });
    }

    findTodo.title = title;
    findTodo.deadline = new Date(deadline);

    return response.status(200).json(findTodo);
  } catch (error) {
    console.log(error);
    return response
      .status(400)
      .json({ error: "Unexpected error while updating Todo" });
  }
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  try {
    const user = request.user;
    const { id } = request.params;

    const findTodo = user.todos.find((todo) => todo.id === id);

    if (!findTodo) {
      return response.status(404).json({ error: "Todo not found" });
    }

    findTodo.done = true;

    return response.status(200).json(findTodo);
  } catch (error) {
    console.log(error);
    return response
      .status(400)
      .json({ error: "Unexpected error while setting Todo done" });
  }
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  try {
    const user = request.user;
    const { id } = request.params;

    const findTodo = user.todos.find((todo) => todo.id === id);

    if (!findTodo) {
      return response.status(404).json({ error: "Todo not found" });
    }

    const filteredTodos = user.todos.filter((todo) => todo.id !== id);

    user.todos = filteredTodos;
    return response.status(204).json();
  } catch (error) {
    console.log(error);
    return response
      .status(400)
      .json({ error: "Unexpected error while deleting Todo" });
  }
});

module.exports = app;

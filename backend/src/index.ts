import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: "*" }));
app.use(express.json());

// User Routes
app.post("/user", async (req, res) => {
  const { userId } = req.body;
  console.log("Api hit", userId);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { userId },
    });

    if (existingUser) {
      console.log("User already exists");
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await prisma.user.create({
      data: { userId },
    });

    console.log("User created");
    return res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  console.log("API hit");
  res.json({ working: "Fine" });
});

// Todo Routes
app.post("/todos", async (req, res) => {
  const { title, userId } = req.body;

  try {
    const todo = await prisma.todo.create({
      data: { title, userId },
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while creating the todo" });
  }
});

app.get("/todos/:userId", async (req, res) => {
  const { userId } = req.params;
  const todos = await prisma.todo.findMany({ where: { userId } });
  res.json(todos);
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const todo = await prisma.todo.update({
      where: { id },
      data: { title, completed },
    });
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating the todo" });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      return res.status(404).json({ error: "Todo item not found" });
    }

    await prisma.todo.delete({ where: { id } });

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while deleting the todo item" });
  }
});

// Replicache Push Endpoint
app.post("/replicache/push", async (req, res) => {
  const { mutations } = req.body;

  try {
    for (const mutation of mutations) {
      const { name, args } = mutation;

      switch (name) {
        case "createTodo":
          await prisma.todo.create({ data: args });
          break;
        case "updateTodo":
          await prisma.todo.update({ where: { id: args.id }, data: args });
          break;
        case "deleteTodo":
          await prisma.todo.delete({ where: { id: args.id } });
          break;
        case "completeTodo":
          await prisma.todo.update({ where: { id: args.id }, data: { completed: args.completed } });
          break;
        default:
          throw new Error(`Unknown mutation: ${name}`);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error processing mutations:", error);
    res.status(500).json({ error: "Error processing mutations" });
  }
});

// Replicache Pull Endpoint
app.get("/replicache/pull", async (req, res) => {
  try {
    const todos = await prisma.todo.findMany();
    res.json({ todos });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Error fetching todos" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

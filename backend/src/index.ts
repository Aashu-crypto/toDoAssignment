import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// User Routes
app.post("/user", async (req, res) => {
  const { userId } = req.body;
  const user = await prisma.user.create({ data: { userId } });
  res.json(user);
});
app.get("/", (req, res) => {
  res.json({ working: "Fine" });
});
// Todo Routes
app.post("/todos", async (req, res) => {
  const { title, userId } = req.body;
  const todo = await prisma.todo.create({ data: { title, userId } });
  res.json(todo);
});

app.get("/todos/:userId", async (req, res) => {
  const { userId } = req.params;
  const todos = await prisma.todo.findMany({ where: { userId } });
  res.json(todos);
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const todo = await prisma.todo.update({
    where: { id },
    data: { title, completed },
  });
  res.json(todo);
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.todo.delete({ where: { id } });
  res.sendStatus(204);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

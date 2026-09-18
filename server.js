const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const FILE = "tasks.json";

function readTasks() {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE));
}

function saveTasks(tasks) {
    fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}

// Отримати всі задачі
app.get("/tasks", (req, res) => {
    res.json(readTasks());
});

// Додати задачу
app.post("/tasks", (req, res) => {
    const tasks = readTasks();

    const task = {
        id: Date.now(),
        text: req.body.text,
        completed: false
    };

    tasks.push(task);
    saveTasks(tasks);

    res.json(task);
});

// Позначити виконаною
app.put("/tasks/:id", (req, res) => {
    const tasks = readTasks();

    const task = tasks.find(t => t.id == req.params.id);

    if (!task) return res.sendStatus(404);

    task.completed = !task.completed;

    saveTasks(tasks);

    res.json(task);
});

// Видалити
app.delete("/tasks/:id", (req, res) => {
    let tasks = readTasks();

    tasks = tasks.filter(t => t.id != req.params.id);

    saveTasks(tasks);

    res.sendStatus(204);
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
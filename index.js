const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// In-memory "database"
let todos = [];

// Routes
app.get("/", (req, res) => {
    const { priority } = req.query;
    let filteredTodos = todos;

    if (priority && priority !== "All") {
        filteredTodos = todos.filter(todo => todo.priority === priority);
    }

    res.render("index", { todos: filteredTodos });
});

app.post("/add-todo", (req, res) => {
    const { title, priority } = req.body;

    if (title.trim()) {
        const newTodo = {
            id: Date.now().toString(),
            title,
            priority
        };
        todos.push(newTodo);
    }

    res.redirect("/");
});

app.post("/edit-todo/:id", (req, res) => {
    const { id } = req.params;
    const { title, priority } = req.body;

    todos = todos.map(todo => 
        todo.id === id ? { ...todo, title, priority } : todo
    );

    res.redirect("/");
});

app.post("/delete-todo/:id", (req, res) => {
    const { id } = req.params;
    todos = todos.filter(todo => todo.id !== id);
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

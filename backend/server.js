const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const app = express();

app.use(cors()); 
app.use(express.json());

// ✅ Local MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/todo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Db connected successfully to local MongoDB");
})
.catch((err) => console.log("MongoDB connection error:", err));

// Schema and Model
const todoschema = new mongoose.Schema({
  title: String,
  description: String
});
const todoModel = mongoose.model('task', todoschema);

// Create todo
app.post('/todo', async (req, res) => {
  const { title, description } = req.body;
  try {
    const newtodo = new todoModel({ title, description });
    await newtodo.save();
    res.status(200).json(newtodo);
  } catch (err) {
    console.error("Error saving todo:", err);
    res.status(500).json({ error: "Error saving todo" });
  }
});

// Get all todos
app.get('/todo', async (req, res) => {
  try {
    const todo = await todoModel.find();
    res.json(todo);
  } catch (err) {
    console.error("Error retrieving todos:", err);
    res.status(500).json({ error: "Error retrieving todos" });
  }
});

// Update todo
app.put('/todo/:id', async (req, res) => {
  const { title, description } = req.body;
  const id = req.params.id;
  try {
    const u_todo = await todoModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (u_todo) res.json(u_todo);
    else res.status(404).json({ message: "Todo not found" });
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ error: "Error updating todo" });
  }
});

// Delete todo
app.delete('/todo/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await todoModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ error: "Error deleting todo" });
  }
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

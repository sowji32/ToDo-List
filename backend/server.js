const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const app = express();

app.use(cors()); 
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/todo_db')
  .then(() => {
    console.log("Db connected successfully");
  })
  .catch((err) => console.log(err));

const todoschema = new mongoose.Schema({
  title: String,
  description: String
});
const todoModel = mongoose.model('task', todoschema);

app.post('/todo', async (req, res) => {
  const { title, description } = req.body;
  try {
    const newtodo = new todoModel({ title, description });
    await newtodo.save();
    res.status(200).json(newtodo);
  } catch (err) {
    console.error("error", err);
    res.status(500).json({ error: "Error saving todo" });
  }
});

app.get('/todo', async (req, res) => {
  try {
    const todo = await todoModel.find();
    res.json(todo);
  } catch (err) {
    console.error("error", err);
    res.status(500).json({ error: "Error retrieving todos" });
  }
});

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
    console.error("error", err);
    res.status(500).json({ error: "Error updating todo" });
  }
});

app.delete('/todo/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await todoModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("error", err);
    res.status(500).json({ error: "Error deleting todo" });
  }
});

const port = 3000; 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

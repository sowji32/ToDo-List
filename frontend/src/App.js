import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch todos
  const getitem = () => {
    fetch('http://localhost:3000/todo')
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getitem();
  }, []);

  const funsubmit = () => {
    if (title.trim() !== '' && description.trim() !== '') {
      fetch('http://localhost:3000/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => res.json())
        .then(() => {
          setTitle('');
          setDescription('');
          setMessage('Added successfully!');
          setTimeout(() => setMessage(''), 2000);
          getitem();
        })
        .catch((err) => {
          console.error(err);
          setError('Something went wrong');
          setTimeout(() => setError(''), 2000);
        });
    } else {
      setError('Title and Description cannot be empty');
      setTimeout(() => setError(''), 2000);
    }
  };
  const updateitem = () => {
    if (title.trim() !== '' && description.trim() !== '') {
      fetch(`http://localhost:3000/todo/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => res.json())
        .then(() => {
          setTitle('');
          setDescription('');
          setMessage('Updated successfully!');
          setTimeout(() => setMessage(''), 2000);
          setIsEditing(false);
          setEditId(null);
          getitem();
        })
        .catch((err) => {
          console.error(err);
          setError('Something went wrong');
          setTimeout(() => setError(''), 2000);
        });
    } else {
      setError('Title and Description cannot be empty');
      setTimeout(() => setError(''), 2000);
    }
  };
  const handleEdit = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setIsEditing(true);
    setEditId(todo._id);
  };

  const deleteitem = (id) => {
    if(window.confirm("confirm delete")){
    fetch(`http://localhost:3000/todo/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
         const update=(todos.filter((todo) => todo._id !== id));
         setTodos(update)
        } else {
          throw new Error('Delete failed');
        }
      })
      .catch((err) => console.error(err));
  }};

  return (
    <>
      <div className="App text-center mt-3">
        <h2>Todo Project</h2>
      </div>

      <div className="container p-4">
        <div className="formgrp d-flex gap-3 mb-3">
          <input
            id='title_1'
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
          />
          <input
          name='des'
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            type="text"
          />
          {isEditing ? (
            <button  className="btn btn-warning" onClick={updateitem}>
              Update
            </button>
          ) : (
            <button name='click' className="btn btn-info" onClick={funsubmit}>
              Submit
            </button>
          )}
        </div>

        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}

        <ul className="list-group mt-4">
          {todos.map((todo, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div className='d-flex flex-column'>
                <span>Title</span>
                <span>Description</span>
              </div>
              <div className="d-flex flex-column">
                <strong>{todo.title}</strong>
                <span>{todo.description}</span>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-success" onClick={() => handleEdit(todo)}>
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteitem(todo._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;

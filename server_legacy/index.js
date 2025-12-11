import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Mock Data
let users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Editor', status: 'Active' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'User', status: 'Active' },
  { id: 5, name: 'Evan Wright', email: 'evan@example.com', role: 'Admin', status: 'Inactive' },
  { id: 6, name: 'Fiona Gallagher', email: 'fiona@example.com', role: 'User', status: 'Active' },
  { id: 7, name: 'George Martin', email: 'george@example.com', role: 'Editor', status: 'Active' },
  { id: 8, name: 'Hannah Abbott', email: 'hannah@example.com', role: 'User', status: 'Inactive' },
];

// GET /api/users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// POST /api/users
app.post('/api/users', (req, res) => {
  const newUser = req.body;
  const id = Math.max(...users.map(u => u.id), 0) + 1;
  const userWithId = { ...newUser, id };
  users.unshift(userWithId); // Add to beginning
  res.status(201).json(userWithId);
});

// PUT /api/users/:id
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  users = users.map(user => user.id === parseInt(id) ? { ...user, ...updatedUser } : user);
  res.json(updatedUser);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

const Leader = mongoose.model('leader', new mongoose.Schema({
  name: String,
  region: String,
  town: String,
  badge: String,
  specialty: String,
  aceLevel: Number,
  motto: String
}));

// GET: read all leaders from the database
app.get('/api/leader', async (req, res) => {
  const leader = await Leader.find();
  res.send(leader);
});

// POST: save a new leader
app.post('/api/leader', async (req, res) => {
  const leader = new Leader(req.body);
  await leader.save();
  res.send(leader); console.log("Added new leader:", leader);
});

// DELETE: remove a leader by its MongoDB _id
app.delete('/api/leader/:id', async (req, res) => {
  await Leader.findByIdAndDelete(req.params.id);
  res.sendStatus(204); // 204 = success, no content to send back
});

// PUT: update a leader by its MongoDB _id
app.put('/api/leader/:id', async (req, res) => {
  const updated = await Leader.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(updated); // { new: true } returns the updated document
});

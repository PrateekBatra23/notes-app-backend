const express = require('express');
const cors = require('cors');


const PORT = 5000;
const app = express();
app.use(cors());
app.use(express.json()); 
let notes = [];


app.post('/api/notes', (req, res) => {
  const note = req.body;
  if (!note.title || !note.content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  
  note.id = Date.now(); 
  note.createdAt = new Date().toISOString();
  
  notes.unshift(note); 
  res.status(201).json({ message: 'Note added successfully', note });
});



app.delete('/api/notes/:id', (req, res) => {
  const noteId = Number(req.params.id);
  const originalLength = notes.length;
  notes = notes.filter(note => note.id !== noteId);
  
  if (notes.length === originalLength) {
    return res.status(404).json({ message: 'Note not found' });
  }
  
  res.json({ message: 'Note deleted successfully' });
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.listen(5000, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

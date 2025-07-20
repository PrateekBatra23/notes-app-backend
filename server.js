const express = require('express');
const cors = require('cors');


const PORT = 5000;
const app = express();
app.use(cors());
app.use(express.json()); 

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

const Note = require('./models/Note');

app.post('/api/notes', async (req, res) => {
  const note = req.body;
  if (!note.title || !note.content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  
  const newNote =new Note(note);
  await newNote.save();
  res.status(201).json({ message: 'Note added successfully', note: newNote });
});



app.delete('/api/notes/:id', async (req, res) => {
  const noteId = req.params.id;

  try {
    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error during deletion' });
  }
});


app.get('/api/notes', async(req, res) => {
  const notes=await Note.find().sort({createdAt:-1});
  res.json(notes);
});

app.put('/api/notes/:id', async (req, res) => {
  const { title, content } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true } 
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note updated successfully', note: updatedNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update note' });
  }
});


app.listen(5000, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

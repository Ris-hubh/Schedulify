const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://mimyrishabh:<B14b7b82b84b85>@cluster0.jpjkztq.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Schema and Model for Events
const eventSchema = new mongoose.Schema({
    date: String,
    description: String,
    priority: String,
    checked: Boolean,
});

const Event = mongoose.model('Event', eventSchema);

// Routes
// Get events for a specific month
app.get('/events/:month', async (req, res) => {
    const { month } = req.params;
    try {
        const events = await Event.find({ date: { $regex: `^${month}` } });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Add a new event
app.post('/events', async (req, res) => {
    const { date, description, priority, checked } = req.body;
    try {
        const newEvent = new Event({ date, description, priority, checked });
        await newEvent.save();
        res.json(newEvent);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add event' });
    }
});

// Update an event (e.g., mark as checked)
app.put('/events/:id', async (req, res) => {
    const { id } = req.params;
    const { checked } = req.body;
    try {
        const updatedEvent = await Event.findByIdAndUpdate(id, { checked }, { new: true });
        res.json(updatedEvent);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update event' });
    }
});

// Delete an event
app.delete('/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Event.findByIdAndDelete(id);
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

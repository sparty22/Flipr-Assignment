const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], 
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://vc142222:LxJqzQO9sJCFpJW3@cluster0.yr8qm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>{
    console.log("mongodb connected");
})
.catch((err)=>{
    console.log("error" , err)
})

const User = require('./models/user');
app.use(express.static(path.join(__dirname, 'public')));


app.post('/submit-form', async (req, res) => {
    console.log('Form submission received:', req.body);

    try {
        const newUser = new User(req.body);
        await newUser.save(); // Save the document to MongoDB
        res.status(200).json({ message: 'User saved successfully' });
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/admin/users', async (req, res) => {
    try {
        const users = await User.find(); // Replace `User` with your actual model
        res.status(200).json(users); // Send users as JSON
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/admin/add-user', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); // Return saved user to the client
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.delete('/admin/delete-user/:id', async (req, res) => {
    try {
        const User = mongoose.model('User'); // Ensure User model is imported only once
        const result = await User.findByIdAndDelete(req.params.id); // Fetch and delete by ID
        if (!result) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully!' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});



const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const Plant = require('./models/Plant');


const app = express();
const PORT = process.env.PORT ? process.env.PORT : '3000';
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

// Test Route
app.get('/test', (req, res) => {
    res.send('Server is running!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });







app.get('/plants', async (req, res) => {
    const plants = await Plant.find({});
    res.render('index', { plants });
});


app.get('/plants/new', (req, res) => {
    res.render('new');
});


app.post('/plants', async (req, res) => {
    await Plant.create(req.body);
    res.redirect('/plants');
});


app.get('/plants/:id', async (req, res) => {
    const plant = await Plant.findById(req.params.id);
    res.render('show', { plant });
});


app.get('/plants/:id/edit', async (req, res) => {
    const plant = await Plant.findById(req.params.id);
    res.render('edit', { plant });
});


app.post('/plants/:id', async (req, res) => {
    try {
        // Use findByIdAndUpdate with { new: true } to return the updated document
        const updatedPlant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        // If no document was found and updated, return a 404 error
        if (!updatedPlant) return res.status(404).send('Plant not found');
        
        // Redirect to the updated plant's page
        res.redirect(`/plants/${req.params.id}`);
    } catch (err) {
        // Handle any unexpected errors
        res.status(500).send('1Internal Server Error');
    }
});


app.post('/plants/:id', async (req, res) => {
  try {
      const plant = await Plant.findByIdAndDelete(req.params.id);
      if (!plant) {
          return res.status(404).send('Plant not found');
      }
      res.redirect('/plants');
  } catch (err) {
      res.status(500).send('Internal Server Error');
  }
});


app.delete('/plants/:id', (req, res) => {
    const plantId = req.params.id;
    // Code to delete the plant with the given ID
    res.send(`Plant with ID ${plantId} deleted.`);
});



const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const Plant = require('./models/Plant');


const app = express();
const PORT = process.env.PORT ? process.env.PORT : '3000';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');


app.get('/test', (req, res) => {
    res.send('Server is running!');
});

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
     
        const updatedPlant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlant) return res.status(404).send('Plant not found');
        res.redirect(`/plants/${req.params.id}`);
    } catch (err) {
        res.status(500).send('1Internal Server Error');
    }
});


app.delete('/plants/:id/d', async (req, res) => {
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



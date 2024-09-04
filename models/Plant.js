const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    name: String,
    type: String,
    waterNeeds: String
});

module.exports = mongoose.model('Plant', plantSchema);

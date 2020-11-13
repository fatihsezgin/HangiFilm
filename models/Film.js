const mongoose = require('mongoose');

const { Schema } = mongoose;

const FilmSchema = new Schema({
  name: { type: String, required: true },
  date: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Film', FilmSchema);

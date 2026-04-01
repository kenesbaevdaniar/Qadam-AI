const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  subject: { type: String, required: true }, // Например, "История Казахстана"
  topic: { type: String, required: true },   // Например, "Золотая Орда"
  questions: [{
    question: String,
    options: [String],
    correctIndex: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', testSchema);
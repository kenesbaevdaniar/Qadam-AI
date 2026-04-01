const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        index: true
    },
    text: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswer: {
        type: Number, // Индекс правильного ответа (0, 1, 2...)
        required: true
    },
    explanation: {
        type: String,
        default: ""
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Question', QuestionSchema);

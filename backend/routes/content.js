const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// 1. Получение списка предметов и РЕАЛЬНОГО количества вопросов из базы
router.get('/subjects', async (req, res) => {
    try {
        const subjectsList = [
            { name: "Математическая грамотность", icon: "📊" },
            { name: "История Казахстана", icon: "🇰🇿" },
            { name: "Грамотность чтения", icon: "📖" },
            { name: "Математика (профильная)", icon: "📐" },
            { name: "Физика", icon: "⚡" },
            { name: "Информатика", icon: "💻" },
            { name: "Английский язык", icon: "🇬🇧" },
            { name: "Биология", icon: "🧬" }
        ];

        // Для каждого предмета считаем реальное кол-во в базе
        const subjectsWithCounts = await Promise.all(subjectsList.map(async (sub) => {
            const count = await Question.countDocuments({ subject: sub.name });
            return { ...sub, count };
        }));

        res.json(subjectsWithCounts);
    } catch (err) {
        console.error("Error fetching subjects:", err);
        res.status(500).json({ error: "Ошибка сервера при получении предметов" });
    }
});

// 2. Получение тестов по конкретному предмету
router.get('/questions/:subject', async (req, res) => {
    try {
        const questions = await Question.find({ subject: req.params.subject }).limit(50);
        res.json(questions);
    } catch (err) {
        console.error("Error fetching questions:", err);
        res.status(500).json({ error: "Ошибка при загрузке тестов" });
    }
});

module.exports = router;
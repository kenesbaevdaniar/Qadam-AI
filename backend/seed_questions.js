const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Question = require('./models/Question');

const subjectMap = {
    "mathematics": "Математика (профильная)",
    "history_kz": "История Казахстана",
    "math_literacy": "Математическая грамотность",
    "reading_literacy": "Грамотность чтения",
    "Информатика": "Информатика"
};

async function seedQuestions() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Подключено к MongoDB");

        const dataPath = path.join(__dirname, 'data', 'ent_questions.json');
        if (!fs.existsSync(dataPath)) {
            console.error("❌ Файл ent_questions.json не найден");
            process.exit(1);
        }

        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        
        let questionsToInsert = [];

        rawData.forEach(block => {
            const blockQuestions = block.questions || [];
            
            blockQuestions.forEach(q => {
                let rawSubject = q.subject || block.block || "Неизвестный предмет";
                
                // Переводим английские названия в правильные русские
                let cleanSubject = subjectMap[rawSubject] || rawSubject;
                
                // Исправляем блок математики, если он был записан как "Математика (часть 1 из 2)"
                if (cleanSubject.includes("Математика")) {
                    if (cleanSubject.includes("грамотность")) {
                        cleanSubject = "Математическая грамотность";
                    } else {
                        cleanSubject = "Математика (профильная)";
                    }
                }

                // В некоторых местах Информатика могла быть записана так:
                if (rawSubject === "Информатика") {
                    cleanSubject = "Информатика";
                }

                const text = q.text || q.question;
                
                const correctText = q.answer || q.correctAnswer;
                let correctIndex = q.options ? q.options.indexOf(correctText) : 0;
                
                if (correctIndex === -1) {
                    correctIndex = 0;
                }

                questionsToInsert.push({
                    subject: cleanSubject,
                    text: text,
                    options: q.options || [],
                    correctAnswer: correctIndex,
                    explanation: q.explanation || "",
                    difficulty: q.difficulty || "medium"
                });
            });
        });

        console.log(`📄 Подготовлено к загрузке: ${questionsToInsert.length} вопросов`);

        // Чтобы не было дублей и смешанных старых названий, удаляем ВООБЩЕ ВСЕ вопросы перед загрузкой,
        // так как сейчас мы загружаем свежую генеральную базу.
        await Question.deleteMany({});
        console.log(`🧹 Вся база вопросов очищена для новой чистой загрузки`);

        // Вставляем новые
        if (questionsToInsert.length > 0) {
            await Question.insertMany(questionsToInsert);
            console.log("🚀 Все вопросы успешно импортированы в базу данных под правильными именами!");
        } else {
            console.log("⚠️ Не найдено вопросов для импорта.");
        }

        mongoose.connection.close();
        console.log("👋 Соединение закрыто");
    } catch (err) {
        console.error("🔥 Ошибка при импорте:", err);
        process.exit(1);
    }
}

seedQuestions();

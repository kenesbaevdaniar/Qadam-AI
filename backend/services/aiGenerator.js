const Test = require('../models/Test');
const API_KEY = process.env.GEMINI_API_KEY;
const URL = API_KEY
  ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(API_KEY)}`
  : null;

async function autoGenerateTest(subject, topic) {
  const prompt = `Сгенерируй тест для ЕНТ по предмету ${subject} на тему ${topic}. 
  Ответ дай строго в формате JSON: [{"question": "текст", "options": ["1", "2", "3", "4"], "correctIndex": 0}]`;

  try {
    if (!URL) {
      console.error("GEMINI_API_KEY не задан. Автогенерация тестов пропущена.");
      return;
    }

    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();
    
    // Превращаем текст от ИИ в массив объектов
    const questions = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json|```/g, ''));

    // АВТОМАТИЧЕСКОЕ СОХРАНЕНИЕ В БАЗУ
    const newTest = new Test({ subject, topic, questions });
    await newTest.save();

    console.log(`Тест по теме ${topic} успешно создан и сохранен автоматически!`);
  } catch (error) {
    console.error("Ошибка авто-генерации:", error.message);
  }
}

module.exports = { autoGenerateTest };
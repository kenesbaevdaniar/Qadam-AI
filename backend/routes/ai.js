const express = require('express');
const router = express.Router();

// Конфигурация OpenRouter API
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemma-3-27b-it:free';

const systemInstruction = `Имя: Qadam AI Assistant. 
Цель: Помощь абитуриентам Казахстана (ЕНТ 2026, ВУЗы, гранты).
Тон: Вежливый, на языке пользователя.
Навигация: Главная , ВУЗы , Тренажер ЕНТ , Гранты .`;

const chatHistories = new Map();

router.post('/chat', async (req, res) => {
    const { message } = req.body;
    const chatId = req.headers['x-chat-id'] || `temp-${req.ip}`;

    if (!message) return res.status(400).json({ error: "Пустое сообщение" });

    try {
        if (!OPENROUTER_API_KEY) throw new Error("No API Key");

        let history = chatHistories.get(chatId) || [];

        // Для максимальной совместимости объединяем системную инструкцию с первым сообщением
        const prompt = history.length === 0
            ? `[SYSTEM: ${systemInstruction}]\n\nUSER: ${message}`
            : message;

        const messages = [
            ...history,
            { role: "user", content: prompt }
        ];

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY.trim()}`,
                'HTTP-Referer': 'https://qadam.ai',
                'X-Title': 'Qadam AI v2.2'
            },
            body: JSON.stringify({
                model: OPENROUTER_MODEL,
                messages: messages,
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('OpenRouter Error:', data);
            // Если модель забита, пробуем авто-выбор
            if (response.status === 429) {
                return res.status(429).json({
                    response: "Бесплатные сервера сейчас перегружены. Пожалуйста, подождите 30 секунд или попробуйте еще раз."
                });
            }
            throw new Error(data.error?.message || "API Error");
        }

        const aiResponse = data.choices?.[0]?.message?.content || "Ошибка получения ответа.";

        // Обновляем историю
        history.push({ role: "user", content: message });
        history.push({ role: "assistant", content: aiResponse });
        if (history.length > 6) history = history.slice(-6);
        chatHistories.set(chatId, history);

        return res.json({ response: aiResponse });

    } catch (error) {
        console.error('AI Error:', error.message);
        return res.status(500).json({ response: "Произошла ошибка. Попробуйте еще раз." });
    }
});

module.exports = router;

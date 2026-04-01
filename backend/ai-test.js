// backend/ai-test.js
const API_KEY = process.env.GEMINI_API_KEY;
const URL = API_KEY
  ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(API_KEY)}`
  : null;

async function testAI() {
  console.log("Пробую подключиться к Gemini 2.0 Flash (с проверкой лимитов)...");

  const data = {
    contents: [{ parts: [{ text: "Напиши только одно слово: Готово" }] }]
  };

  try {
    if (!URL) {
      console.error("GEMINI_API_KEY не задан. Пропускаем ai-test.");
      return;
    }

    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.status === 429) {
      console.log("--------------------------------------------------");
      console.log("ЛИМИТ ИСЧЕРПАН. Подожди 30 секунд и запусти снова.");
      console.log(`Нужно подождать еще немного перед следующим запросом.`);
      console.log("--------------------------------------------------");
      return;
    }

    if (result.candidates) {
      console.log("----------------------------");
      console.log("УРА! ПОЛНЫЙ КОНТАКТ:");
      console.log(result.candidates[0].content.parts[0].text);
      console.log("----------------------------");
    } else {
      console.log("Ошибка сервера:", JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error("Ошибка сети:", error.message);
  }
}

// Запускаем через 5 секунд на всякий случай, чтобы лимит сбросился
setTimeout(testAI, 5000);
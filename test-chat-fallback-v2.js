// test-chat-fallback-v2.js
async function testChat() {
    console.log("Testing Qadam AI Chat API with Expanded Fallback Knowledge...");
    const questions = [
        "Привет, кто ты?",
        "Какие ВУЗы лучше для IT?",
        "Что делать если ент скоро?",
        "Как поступить на грант?"
    ];

    for (const q of questions) {
        console.log(`\nUser: ${q}`);
        try {
            const response = await fetch('http://localhost:5000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: q })
            });
            const data = await response.json();
            console.log("AI Response:", data.response);
            console.log("Is Fallback:", data.isFallback || false);
        } catch (e) {
            console.error("Test failed:", e.message);
        }
    }
}
testChat();

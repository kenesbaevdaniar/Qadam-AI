// test-chat-sdk.js
async function testChat() {
    console.log("Testing Qadam AI Chat API with SDK...");
    try {
        const response = await fetch('http://localhost:5000/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "Привет, расскажи о ВУЗах Атырау" })
        });
        const data = await response.json();
        console.log("Response status:", response.status);
        if (data.response) {
            console.log("AI Response snippet:", data.response.substring(0, 100) + "...");
        } else {
            console.log("Server response:", data);
        }
    } catch (e) {
        console.error("Test failed:", e.message);
    }
}
testChat();

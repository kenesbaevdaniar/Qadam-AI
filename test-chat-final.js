// test-chat-final.js
async function testChat() {
    console.log("Testing Qadam AI Chat API with Stable Model...");
    const q = "Какие университеты есть в Алматы?";
    console.log(`\nUser: ${q}`);
    try {
        const response = await fetch('http://localhost:5000/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: q })
        });
        const data = await response.json();
        console.log("Full Server Response:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Test failed:", e.message);
    }
}
testChat();

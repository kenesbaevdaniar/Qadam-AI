const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-lite:free';

async function testOpenRouter() {
    console.log('Testing OpenRouter with model:', OPENROUTER_MODEL);
    if (!OPENROUTER_API_KEY) {
        console.error('OPENROUTER_API_KEY is missing!');
        return;
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://qadam.ai',
                'X-Title': 'Qadam AI Assistant Test'
            },
            body: JSON.stringify({
                model: OPENROUTER_MODEL,
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: "Hello, who are you?" }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            console.error('API Error:', response.status, err);
            return;
        }

        const data = await response.json();
        console.log('Success! Response:', data.choices[0].message.content);
    } catch (error) {
        console.error('Fetch Error:', error.message);
    }
}

testOpenRouter();

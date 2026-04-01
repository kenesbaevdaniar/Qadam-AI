const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const XAI_API_KEY = process.env.XAI_API_KEY;
const GROK_MODEL = process.env.GROK_MODEL || 'grok-2-1212';

async function testGrok() {
    console.log('Testing Grok with model:', GROK_MODEL);
    if (!XAI_API_KEY) {
        console.error('XAI_API_KEY is missing!');
        return;
    }

    try {
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${XAI_API_KEY}`
            },
            body: JSON.stringify({
                model: GROK_MODEL,
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: "Hello, who are you?" }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            const err = await response.json();
            console.error('API Error:', response.status, err);
            return;
        }

        const data = await response.json();
        console.log('Success! Response:', data.choices[0].message.content);
    } catch (error) {
        console.error('Fetch Error:', error.message);
    }
}

testGrok();

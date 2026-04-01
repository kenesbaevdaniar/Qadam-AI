const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function listModels() {
    console.log('Fetching available models from OpenRouter...');
    if (!OPENROUTER_API_KEY) {
        console.error('OPENROUTER_API_KEY is missing!');
        return;
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`
            }
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            console.error('API Error:', response.status, err);
            return;
        }

        const data = await response.json();
        console.log('Available models:');
        data.data.forEach(m => console.log(`- ${m.id}`));
    } catch (error) {
        console.error('Fetch Error:', error.message);
    }
}

listModels();

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first'); // Принудительный IPv4

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-chat-id']
}));

// Папка для загруженных изображений (доступна по /uploads/...)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/content', require('./routes/content'));
app.use('/api/universities', require('./routes/universities'));
app.use('/api/ai', require('./routes/ai'));

// Подключение к БД
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('🚀🚀🚀 QADAM В СЕТИ (v2.3 Gemini 2.5)! 🚀🚀🚀');
    })
    .catch(err => {
        console.log('❌ Ошибка подключения:');
        console.error(err.message);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер на порту ${PORT}`));
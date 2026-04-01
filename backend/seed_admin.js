// Создаёт администратора, если в БД ещё нет ни одного пользователя с ролью admin.
// Запуск из папки backend: node seed_admin.js
// Логин/пароль задаются через переменные окружения (см. .env.example).

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@qadam.kz';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Администратор';

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Подключились к MongoDB');

        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('ℹ️ Администратор уже есть:', existingAdmin.email);
            await mongoose.disconnect();
            process.exit(0);
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

        const admin = new User({
            username: ADMIN_USERNAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            city: 'Атырау',
            role: 'admin'
        });
        await admin.save();

        console.log('✅ Создан администратор:');
        console.log('   Email:', ADMIN_EMAIL);
        console.log('   Пароль:', ADMIN_PASSWORD);
        console.log('   Войдите на сайт под этим аккаунтом для доступа к добавлению ВУЗов.');
    } catch (err) {
        console.error('❌ Ошибка:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Соединение с MongoDB закрыто');
        process.exit(0);
    }
}

seedAdmin();

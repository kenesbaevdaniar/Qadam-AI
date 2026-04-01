const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Путь: /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, city } = req.body;

        // 1. Проверяем, существует ли пользователь
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Пользователь с таким email уже есть' });
        }

        // 2. Создаем экземпляр нового пользователя
        user = new User({ username, email, password, city });

        // 3. Хешируем пароль (Hash)
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Сохраняем в БД
        await user.save();

        res.status(201).json({ msg: 'Регистрация прошла успешно!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

module.exports = router;

const jwt = require('jsonwebtoken');

// Путь: /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Проверяем, существует ли пользователь
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Неверный email или пароль' });
        }

        // 2. Сравниваем пароль с зашифрованным в базе
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Неверный email или пароль' });
        }

        // 3. Создаем JWT токен (действует 24 часа)
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ msg: 'JWT_SECRET не задан на сервере' });
        }

        const token = jwt.sign(
            { userId: user._id }, 
            jwtSecret, 
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email, city: user.city, role: user.role || 'user' }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});
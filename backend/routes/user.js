const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const User = require('../models/User');

// --- НАСТРОЙКА MULTER ДЛЯ АВАТАРОК ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../uploads/profiles');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Имя файла: user_id_timestamp.ext
        const ext = path.extname(file.originalname);
        cb(null, `avatar_${req.user.userId}_${Date.now()}${ext}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB допуск
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Только изображения (jpg, png, webp)!"));
    }
});

// --- РОУТЫ ---

// 1. Получить профиль пользователя (+ данные об избранном)
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('-password')
            .populate('favorites');
        if (!user) return res.status(404).json({ msg: 'Пользователь не найден' });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

// 2. Загрузить аватар
router.post('/upload-avatar', auth, (req, res, next) => {
    // Обертка для перехвата ошибок Multer
    upload.single('avatar')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error("Multer Error:", err);
            return res.status(400).json({ msg: `Ошибка Multer: ${err.message}` });
        } else if (err) {
            console.error("Unknown Upload Error:", err);
            return res.status(500).json({ msg: `Ошибка загрузки: ${err.message}` });
        }
        next();
    });
}, async (req, res) => {
    try {
        console.log("🚀 Загрузка аватара для пользователя:", req.user.userId);
        
        if (!req.file) {
            return res.status(400).json({ msg: 'Файл не выбран' });
        }

        const filePath = `/uploads/profiles/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { profileImage: filePath },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'Пользователь не найден' });
        }

        res.json({
            msg: 'Аватар обновлен!',
            user: user
        });

    } catch (err) {
        console.error("🔥 Server Error in upload-avatar:", err);
        res.status(500).json({ msg: 'Внутренняя ошибка сервера при сохранении аватара' });
    }
});

// 3. Переключить статус "Избранное"
router.post('/favorites/toggle/:uniId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const uniId = req.params.uniId;

        if (!user) return res.status(404).json({ msg: 'Пользователь не найден' });

        const index = user.favorites.indexOf(uniId);
        let status = false;
        if (index === -1) {
            user.favorites.push(uniId);
            status = true;
        } else {
            user.favorites.splice(index, 1);
            status = false;
        }

        await user.save();
        res.json({ msg: status ? 'Добавлено в избранное' : 'Удалено из избранного', isFavorite: status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Ошибка при обновлении избранного' });
    }
});

module.exports = router;

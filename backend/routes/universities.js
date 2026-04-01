const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const University = require('../models/University');
const requireAdmin = require('../middleware/requireAdmin');

// Multer опционален: если не установлен (npm install), загрузка файлов недоступна, только ссылка на изображение
let multer;
let upload;
try {
    multer = require('multer');
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadsDir),
        filename: (req, file, cb) => {
            const ext = (file.mimetype && file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/i) && file.originalname)
                ? path.extname(file.originalname).toLowerCase() || '.jpg'
                : '.jpg';
            cb(null, 'uni-' + Date.now() + ext);
        }
    });
    upload = multer({
        storage,
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const allowed = /image\/(jpeg|jpg|png|gif|webp)/i;
            if (allowed.test(file.mimetype)) return cb(null, true);
            cb(new Error('Разрешены только изображения (JPEG, PNG, GIF, WebP).'));
        }
    });
} catch (e) {
    // Пакет multer не установлен — используем пустой middleware (файлы не принимаем)
    upload = { single: () => (req, res, next) => next() };
}

// Вспомогательная функция: разбить строку на массив по запятым
function parseArray(str) {
    if (!str || typeof str !== 'string') return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
}

// POST /api/universities — добавление нового ВУЗа (только для администратора)
router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
    try {
        const body = req.body || {};
        
        // Валидация обязательных полей на сервере
        const name = (body.name || '').trim();
        const city = (body.city || '').trim().toUpperCase();
        if (!name || !city) {
            return res.status(400).json({ msg: 'Название и город обязательны для заполнения.' });
        }

        // Изображение: загруженный файл или ссылка
        let imageUrl = (body.imageUrl || '').trim();
        if (req.file && req.file.filename) {
            imageUrl = '/uploads/' + req.file.filename;
        }

        const university = new University({
            name,
            shortCode: (body.shortCode || '').trim(),
            city,
            badgeText: (body.badgeText || '').trim(),
            badgeIcon: (body.badgeIcon || '').trim() || 'fas fa-check-circle',
            grantMin: body.grantMin !== '' && body.grantMin !== undefined ? Number(body.grantMin) : undefined,
            priceFrom: body.priceFrom !== '' && body.priceFrom !== undefined ? Number(body.priceFrom) : undefined,
            tags: parseArray(body.tags),
            majors: parseArray(body.majors),
            website: (body.website || '').trim(),
            imageUrl: imageUrl || undefined,
            description: (body.description || '').trim(),
            address: (body.address || '').trim(),
            phone: (body.phone || '').trim(),
            email: (body.email || '').trim(),
            foundedYear: body.foundedYear !== '' && body.foundedYear !== undefined ? Number(body.foundedYear) : undefined,
            studentsCount: body.studentsCount !== '' && body.studentsCount !== undefined ? Number(body.studentsCount) : undefined,
            rating: body.rating !== '' && body.rating !== undefined ? Number(body.rating) : undefined,
            faculties: parseArray(body.faculties),
            specialties: parseArray(body.specialties),
            dormitory: body.dormitory === 'true' || body.dormitory === '1',
            militaryDepartment: body.militaryDepartment === 'true' || body.militaryDepartment === '1',
            accreditation: (body.accreditation || '').trim(),
            languages: parseArray(body.languages)
        });

        await university.save();
        res.status(201).json(university);
    } catch (err) {
        if (err.message && err.message.includes('Разрешены только изображения')) {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).json({ msg: 'Ошибка сервера при добавлении ВУЗа.' });
    }
});

// GET /api/universities?city=Atyrau&search=IT
router.get('/', async (req, res) => {
    try {
        const { city, search, major } = req.query;
        let query = {};

        // Фильтр по городу
        if (city && city !== 'ALL' && city !== 'all') {
            query.city = city.toUpperCase();
        }

        // Расширенный поиск по базе данных: ищем в названии, описании, направлениях, тегах, специальностях, факультетах
        if (search && search.trim()) {
            const searchRegex = { $regex: search.trim(), $options: 'i' };
            query.$or = [
                { name: searchRegex },
                { description: searchRegex },
                { shortCode: searchRegex },
                { majors: { $in: [new RegExp(search.trim(), 'i')] } },
                { tags: { $in: [new RegExp(search.trim(), 'i')] } },
                { specialties: { $in: [new RegExp(search.trim(), 'i')] } },
                { faculties: { $in: [new RegExp(search.trim(), 'i')] } },
                { city: searchRegex }
            ];
        }

        // Дополнительный фильтр по направлению (major)
        if (major && major.trim()) {
            query.majors = { $in: [new RegExp(major.trim(), 'i')] };
        }

        const universities = await University.find(query).sort({ name: 1 });
        res.json(universities);
    } catch (err) {
        console.error('Ошибка поиска ВУЗов:', err);
        res.status(500).json({ msg: "Ошибка сервера" });
    }
});

// GET /api/universities/:id — один ВУЗ по id для страницы карточки
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const university = await University.findById(id);
        if (!university) {
            return res.status(404).json({ msg: "ВУЗ не найден" });
        }
        res.json(university);
    } catch (err) {
        res.status(500).json({ msg: "Ошибка сервера" });
    }
});

module.exports = router;
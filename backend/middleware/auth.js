const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Получаем токен из заголовка
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Проверяем, есть ли токен
    if (!token) {
        return res.status(401).json({ msg: 'Нет токена, авторизация отклонена' });
    }

    try {
        // Верифицируем токен
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Добавляем userId в запрос
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Токен невалиден' });
    }
};

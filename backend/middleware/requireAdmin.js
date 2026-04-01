const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware: доступ только для пользователя с ролью admin.
 * Ожидает заголовок: Authorization: Bearer <token>
 */
async function requireAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Требуется авторизация' });
    }
    const token = authHeader.slice(7);
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ msg: 'JWT_SECRET не задан на сервере' });
        }

        const decoded = jwt.verify(token, jwtSecret);
        const user = await User.findById(decoded.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ msg: 'Доступ только для администратора' });
        }
        req.user = user;
        next();
    } catch (e) {
        return res.status(401).json({ msg: 'Недействительный или истёкший токен' });
    }
}

module.exports = requireAdmin;

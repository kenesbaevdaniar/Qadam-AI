const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, // Не дает регистрировать две одинаковые почты
        lowercase: true 
    },
    password: { 
    type: String, 
    required: true,
    minlength: [8, 'Пароль должен быть не менее 8 символов'], // Увеличим до 8
    validate: {
        validator: function(v) {
            // Минимум 8 символов, одна заглавная буква и одна цифра
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
        },
        message: 'Пароль должен содержать хотя бы одну заглавную букву и одну цифру!'
    }
    },
    city: { 
        type: String, 
        default: 'Atyrau' 
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    profileImage: {
        type: String,
        default: '' // Будет хранить путь к файлу /uploads/profiles/...
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University'
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('User', UserSchema);
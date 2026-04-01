const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    shortCode: { type: String, trim: true }, // например: "SAT", "AOGU"
    city: { type: String, required: true, trim: true }, // например: "АТЫРАУ"

    // Текст в бейдже сверху справа (например: "Государственный", "Национальный", "ТОП-3 РК")
    badgeText: { type: String, trim: true },
    // Иконка для бейджа (font-awesome класс или символ) — опционально
    badgeIcon: { type: String, trim: true },

    grantMin: { type: Number }, // минимальный балл для гранта
    priceFrom: { type: Number }, // стоимость "от", в тенге

    // Короткие теги/особенности (например: ["Общежитие", "Военная кафедра"])
    tags: { type: [String], default: [] },

    // Направления/ключевые слова для поиска (например: ["IT", "Педагогика"])
    majors: { type: [String], default: [] },

    // Дополнительно (не обязательно)
    website: { type: String, trim: true },
    // Изображение: ссылка (URL) или путь к загруженному файлу (/uploads/...)
    imageUrl: { type: String, trim: true },

    // Расширенные данные для страницы карточки
    description: { type: String, trim: true }, // Описание университета
    address: { type: String, trim: true }, // Полный адрес
    phone: { type: String, trim: true }, // Телефон приемной комиссии
    email: { type: String, trim: true }, // Email
    foundedYear: { type: Number }, // Год основания
    studentsCount: { type: Number }, // Количество студентов
    rating: { type: Number }, // Рейтинг (например, от 1 до 10)
    
    // Факультеты и специальности
    faculties: { type: [String], default: [] }, // Список факультетов
    specialties: { type: [String], default: [] }, // Список специальностей
    
    // Дополнительная информация
    dormitory: { type: Boolean, default: false }, // Есть ли общежитие
    militaryDepartment: { type: Boolean, default: false }, // Есть ли военная кафедра
    accreditation: { type: String, trim: true }, // Аккредитация (например, "Государственная")
    languages: { type: [String], default: [] }, // Языки обучения (например, ["Казахский", "Русский", "Английский"])
  },
  { timestamps: true }
);

module.exports = mongoose.model('University', UniversitySchema);


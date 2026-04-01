const mongoose = require('mongoose');
require('dotenv').config();

const Question = require('./models/Question');

const extraQuestions = [
    // --- БИОЛОГИЯ ---
    {
        subject: "Биология", text: "Структурно-функциональная единица нервной системы:",
        options: ["Нейрон", "Нефрон", "Остеон", "Хондроцит"], correctAnswer: 0
    },
    {
        subject: "Биология", text: "Гормон, понижающий уровень сахара в крови:",
        options: ["Адреналин", "Глюкагон", "Инсулин", "Тироксин"], correctAnswer: 2
    },
    {
        subject: "Биология", text: "Органоид, в котором происходит синтез АТФ:",
        options: ["Рибосома", "Митохондрия", "Лизосома", "Комплекс Гольджи"], correctAnswer: 1
    },
    {
        subject: "Биология", text: "Кровь от сердца течет по:",
        options: ["Артериям", "Венам", "Капиллярам", "Лимфатическим сосудам"], correctAnswer: 0
    },
    {
        subject: "Биология", text: "Основной структурный компонент клеточной стенки растений:",
        options: ["Хитин", "Гликоген", "Целлюлоза", "Муреин"], correctAnswer: 2
    },
    {
        subject: "Биология", text: "Фермент, расщепляющий белки в желудке:",
        options: ["Амилаза", "Пепсин", "Липаза", "Трипсин"], correctAnswer: 1
    },
    {
        subject: "Биология", text: "Наука о наследственности и изменчивости:",
        options: ["Экология", "Генетика", "Цитология", "Эволюция"], correctAnswer: 1
    },
    {
        subject: "Биология", text: "Процесс образования органических веществ из неорганических на свету:",
        options: ["Хемосинтез", "Дыхание", "Фотосинтез", "Брожение"], correctAnswer: 2
    },
    {
        subject: "Биология", text: "Количество хромосом в соматических клетках человека:",
        options: ["46", "23", "48", "24"], correctAnswer: 0
    },
    {
        subject: "Биология", text: "Возбудитель туберкулеза:",
        options: ["Вирус", "Бактерия", "Гриб", "Простейшее"], correctAnswer: 1
    },

    // --- ФИЗИКА ---
    {
        subject: "Физика", text: "Единица измерения силы в системе СИ:",
        options: ["Джоуль", "Ньютон", "Паскаль", "Ватт"], correctAnswer: 1
    },
    {
        subject: "Физика", text: "Прибор для измерения атмосферного давления:",
        options: ["Амперметр", "Барометр", "Термометр", "Динамометр"], correctAnswer: 1
    },
    {
        subject: "Физика", text: "Формула второго закона Ньютона:",
        options: ["F = ma", "E = mc^2", "p = mv", "F = kx"], correctAnswer: 0
    },
    {
        subject: "Физика", text: "Скорость света в вакууме примерно равна:",
        options: ["300 км/с", "3 000 км/с", "300 000 км/с", "30 000 км/с"], correctAnswer: 2
    },
    {
        subject: "Физика", text: "Процесс перехода вещества из жидкого состояния в газообразное:",
        options: ["Плавление", "Парообразование", "Конденсация", "Сублимация"], correctAnswer: 1
    },
    {
        subject: "Физика", text: "Сила выталкивающая тело из жидкости:",
        options: ["Сила тяжести", "Сила Архимеда", "Сила трения", "Сила упругости"], correctAnswer: 1
    },
    {
        subject: "Физика", text: "Электрический ток - это:",
        options: ["Упорядоченное движение заряженных частиц", "Хаотичное движение молекул", "Колебания атомов", "Перенос массы вещества"], correctAnswer: 0
    },
    {
        subject: "Физика", text: "Единица измерения сопротивления:",
        options: ["Ампер", "Вольт", "Ом", "Ватт"], correctAnswer: 2
    },
    {
        subject: "Физика", text: "Ускорение свободного падения на Земле (примерно):",
        options: ["9.8 м/с²", "10.5 м/с²", "8.5 м/с²", "98 м/с²"], correctAnswer: 0
    },
    {
        subject: "Физика", text: "Волна, в которой колебания происходят вдоль направления ее распространения:",
        options: ["Поперечная", "Продольная", "Стоячая", "Электромагнитная"], correctAnswer: 1
    },

    // --- АНГЛИЙСКИЙ ЯЗЫК ---
    {
        subject: "Английский язык", text: "Choose the correct plural form of the word 'child':",
        options: ["childs", "children", "children's", "childrens"], correctAnswer: 1
    },
    {
        subject: "Английский язык", text: "Find the synonym of the word 'happy':",
        options: ["sad", "angry", "joyful", "tired"], correctAnswer: 2
    },
    {
        subject: "Английский язык", text: "She ___ to the cinema yesterday.",
        options: ["go", "went", "goes", "going"], correctAnswer: 1
    },
    {
        subject: "Английский язык", text: "Which word is an adjective?",
        options: ["beauty", "beautifully", "beautiful", "beautify"], correctAnswer: 2
    },
    {
        subject: "Английский язык", text: "Identify the tense in the sentence: 'I have been living here for 5 years.'",
        options: ["Present Continuous", "Present Perfect", "Past Perfect", "Present Perfect Continuous"], correctAnswer: 3
    },
    {
        subject: "Английский язык", text: "Choose the correct preposition: 'I was born ___ May.'",
        options: ["in", "on", "at", "by"], correctAnswer: 0
    },
    {
        subject: "Английский язык", text: "Select the correct relative pronoun: 'The man ___ is standing there is my brother.'",
        options: ["which", "who", "whose", "whom"], correctAnswer: 1
    },
    {
        subject: "Английский язык", text: "'If it rains, we ___ at home.'",
        options: ["would stay", "staying", "will stay", "stay"], correctAnswer: 2
    },
    {
        subject: "Английский язык", text: "Choose the opposite of 'expensive':",
        options: ["rich", "tall", "loud", "cheap"], correctAnswer: 3
    },
    {
        subject: "Английский язык", text: "Find the grammatically correct sentence:",
        options: ["She don't like apples.", "She doesn't likes apples.", "She doesn't like apples.", "She not like apples."], correctAnswer: 2
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB Connected");
        
        // Удалим старые вопросы по этим трем предметам на всякий случай, чтобы не было дублей
        await Question.deleteMany({ subject: { $in: ["Биология", "Физика", "Английский язык"] } });
        
        await Question.insertMany(extraQuestions);
        console.log(`🚀 Успешно добавлено ${extraQuestions.length} вопросов!`);
        
        process.exit(0);
    } catch (e) {
        console.error("Ошибка:", e);
        process.exit(1);
    }
}
seed();

/**
 * EDUPATH AI - Движок тестирования
 * Этот скрипт легко масштабируется для работы с API
 */

// --- 1. БАЗА ВОПРОСОВ (В будущем это будет приходить от ИИ) ---
// --- 1. БАЗА ВОПРОСОВ (30 вопросов) ---
const questions = [
    // --- Блок 1 (Вопросы 1-5) ---
    {
        id: 1,
        text: "Представь, что ты работаешь над крупным проектом. Какая роль тебе ближе?",
        options: [
            { text: "Разработка структуры и технических деталей", type: "tech" },
            { text: "Общение с клиентами и презентация проекта", type: "social" },
            { text: "Создание дизайна и визуального стиля", type: "creative" },
            { text: "Управление бюджетом и командой", type: "business" }
        ]
    },
    {
        id: 2,
        text: "Какой школьный предмет тебе давался легче всего (или был интересен)?",
        options: [
            { text: "Математика, Физика, Информатика", type: "tech" },
            { text: "История, Литература, Языки", type: "social" },
            { text: "ИЗО, Музыка, Черчение", type: "creative" },
            { text: "Обществознание, Экономика", type: "business" }
        ]
    },
    {
        id: 3,
        text: "В свободное время ты скорее предпочтешь...",
        options: [
            { text: "Разобраться, как работает новый гаджет или программа", type: "tech" },
            { text: "Встретиться с друзьями и обсудить новости", type: "social" },
            { text: "Рисовать, писать музыку или монтировать видео", type: "creative" },
            { text: "Придумать идею для стартапа или заработка", type: "business" }
        ]
    },
    {
        id: 4,
        text: "Что для тебя важнее всего в будущей профессии?",
        options: [
            { text: "Инновации и решение сложных задач", type: "tech" },
            { text: "Помощь людям и общение", type: "social" },
            { text: "Свобода самовыражения", type: "creative" },
            { text: "Карьерный рост и высокий доход", type: "business" }
        ]
    },
    {
        id: 5,
        text: "Если бы ты открывал свой бизнес в Атырау, что бы это было?",
        options: [
            { text: "IT-компания по автоматизации нефтедобычи", type: "tech" },
            { text: "Образовательный центр или психология", type: "social" },
            { text: "Студия архитектуры и дизайна", type: "creative" },
            { text: "Логистическая фирма или торговля", type: "business" }
        ]
    },

    // --- Блок 2 (Вопросы 6-10) ---
    {
        id: 6,
        text: "Ты смотришь фильм. На что ты обращаешь внимание в первую очередь?",
        options: [
            { text: "На спецэффекты, монтаж и качество съемки", type: "tech" },
            { text: "На отношения героев и их эмоции", type: "social" },
            { text: "На костюмы, декорации и эстетику кадра", type: "creative" },
            { text: "На бюджет фильма и его кассовые сборы", type: "business" }
        ]
    },
    {
        id: 7,
        text: "В школе организуют концерт. Чем ты займешься?",
        options: [
            { text: "Настрою звук, микрофоны и проектор", type: "tech" },
            { text: "Буду ведущим или помогу гостям найти места", type: "social" },
            { text: "Нарисую афиши и украшу зал", type: "creative" },
            { text: "Организую продажу билетов и составлю расписание", type: "business" }
        ]
    },
    {
        id: 8,
        text: "Твой друг сломал телефон. Твоя реакция?",
        options: [
            { text: "Попробую разобрать и починить сам", type: "tech" },
            { text: "Успокою друга, поддержу его морально", type: "social" },
            { text: "Предложу сделать из старого корпуса крутой арт-объект", type: "creative" },
            { text: "Посоветую, где выгоднее купить новый или продать запчасти", type: "business" }
        ]
    },
    {
        id: 9,
        text: "Какую книгу или статью ты бы прочитал с удовольствием?",
        options: [
            { text: "О последних достижениях в науке и технике", type: "tech" },
            { text: "Биографию известного врача или учителя", type: "social" },
            { text: "Книгу об искусстве, моде или фантастику", type: "creative" },
            { text: "Секреты успеха миллиардеров и инвестиции", type: "business" }
        ]
    },
    {
        id: 10,
        text: "Идеальное рабочее место для тебя — это...",
        options: [
            { text: "Лаборатория или комната с мощными компьютерами", type: "tech" },
            { text: "Кабинет, где можно принимать людей и общаться", type: "social" },
            { text: "Светлая студия, где творческий беспорядок", type: "creative" },
            { text: "Современный офис в центре города или бизнес-центр", type: "business" }
        ]
    },

    // --- Блок 3 (Вопросы 11-15) ---
    {
        id: 11,
        text: "Какую суперсилу ты бы выбрал?",
        options: [
            { text: "Умение управлять любой техникой силой мысли", type: "tech" },
            { text: "Способность исцелять людей и читать эмоции", type: "social" },
            { text: "Создавать любые предметы из воздуха силой воображения", type: "creative" },
            { text: "Предвидеть будущее рынков и убеждать любого человека", type: "business" }
        ]
    },
    {
        id: 12,
        text: "Как ты предпочитаешь решать сложные задачи?",
        options: [
            { text: "Ищу логическое объяснение, строю схемы", type: "tech" },
            { text: "Советуюсь с людьми, ищу коллективное решение", type: "social" },
            { text: "Действую интуитивно, пробую нестандартные подходы", type: "creative" },
            { text: "Делегирую задачи, ищу самый эффективный путь", type: "business" }
        ]
    },
    {
        id: 13,
        text: "Что тебя больше всего раздражает в работе?",
        options: [
            { text: "Нелогичность процессов и устаревшее оборудование", type: "tech" },
            { text: "Конфликты в коллективе и несправедливость", type: "social" },
            { text: "Скука, рутина и жесткие рамки", type: "creative" },
            { text: "Беспорядок, отсутствие цели и низкая прибыль", type: "business" }
        ]
    },
    {
        id: 14,
        text: "Ты выиграл миллион. На что потратишь?",
        options: [
            { text: "Вложу в разработку своего приложения или гаджета", type: "tech" },
            { text: "Открою благотворительный фонд помощи", type: "social" },
            { text: "Сниму фильм или устрою выставку", type: "creative" },
            { text: "Инвестирую в недвижимость или акции", type: "business" }
        ]
    },
    {
        id: 15,
        text: "Какое слово лучше всего описывает тебя?",
        options: [
            { text: "Аналитик", type: "tech" },
            { text: "Альтруист", type: "social" },
            { text: "Творец", type: "creative" },
            { text: "Лидер", type: "business" }
        ]
    },

    // --- Блок 4: Новые вопросы (16-20) ---
    {
        id: 16,
        text: "Какой YouTube-канал ты бы хотел запустить?",
        options: [
            { text: "Обзоры техники, лайфхаки или программирование", type: "tech" },
            { text: "Интервью с людьми, влоги или социальные эксперименты", type: "social" },
            { text: "Скетчи, музыкальные каверы или анимация", type: "creative" },
            { text: "Новости экономики, про деньги и мотивацию", type: "business" }
        ]
    },
    {
        id: 17,
        text: "Тебе подарили путевку в любую точку мира. Куда полетишь?",
        options: [
            { text: "В Кремниевую долину или на завод Tesla", type: "tech" },
            { text: "Волонтером в Африку или в эко-поселение", type: "social" },
            { text: "В Париж, смотреть Лувр и архитектуру", type: "creative" },
            { text: "В Нью-Йорк (Wall Street) или Дубай", type: "business" }
        ]
    },
    {
        id: 18,
        text: "В компьютерной игре ты обычно выбираешь класс...",
        options: [
            { text: "Инженер или Стратег (строишь базы)", type: "tech" },
            { text: "Целитель или Саппорт (помогаешь команде)", type: "social" },
            { text: "Кастомизация (создаешь красивого персонажа)", type: "creative" },
            { text: "Глава гильдии или Торговец", type: "business" }
        ]
    },
    {
        id: 19,
        text: "Лучший подарок на день рождения для тебя — это...",
        options: [
            { text: "Умные часы или конструктор Arduino", type: "tech" },
            { text: "Билет на концерт или вечеринку с друзьями", type: "social" },
            { text: "Набор для рисования, камера или инструмент", type: "creative" },
            { text: "Деньги или подарочная карта (сам решу)", type: "business" }
        ]
    },
    {
        id: 20,
        text: "Если бы ты строил дом мечты, что бы там было главным?",
        options: [
            { text: "Система «Умный дом», голосовое управление, серверная", type: "tech" },
            { text: "Большая гостиная для друзей и уютная кухня", type: "social" },
            { text: "Необычный фасад, панорамные окна, мастерская", type: "creative" },
            { text: "Престижный район, бассейн и высокая цена при перепродаже", type: "business" }
        ]
    },

    // --- Блок 5 (21-25) ---
    {
        id: 21,
        text: "Какая роль в групповом проекте тебе не нравится больше всего?",
        options: [
            { text: "Писать длинные тексты без конкретики", type: "tech" },
            { text: "Работать в одиночку, без обратной связи", type: "social" },
            { text: "Делать скучные таблицы и отчеты по шаблону", type: "creative" },
            { text: "Подчиняться, когда знаешь, как сделать лучше", type: "business" }
        ]
    },
    {
        id: 22,
        text: "Как ты лучше всего запоминаешь информацию?",
        options: [
            { text: "Через схемы, логические цепочки и практику", type: "tech" },
            { text: "Через обсуждение с другими и пересказ", type: "social" },
            { text: "Через образы, ассоциации и картинки", type: "creative" },
            { text: "Через реальные примеры успеха и кейсы", type: "business" }
        ]
    },
    {
        id: 23,
        text: "С кем из великих людей прошлого ты бы поужинал?",
        options: [
            { text: "С Альбертом Эйнштейном или Николой Теслой", type: "tech" },
            { text: "С Матерью Терезой или Мартином Лютером Кингом", type: "social" },
            { text: "С Леонардо да Винчи или Ван Гогом", type: "creative" },
            { text: "С Джоном Рокфеллером или Генри Фордом", type: "business" }
        ]
    },
    {
        id: 24,
        text: "Ты увидел проблему в своем городе. Твои действия?",
        options: [
            { text: "Придумаю приложение или технологию для решения", type: "tech" },
            { text: "Соберу группу волонтеров и мы всё исправим", type: "social" },
            { text: "Сниму социальный ролик, чтобы привлечь внимание", type: "creative" },
            { text: "Напишу проект и найду спонсоров для решения", type: "business" }
        ]
    },
    {
        id: 25,
        text: "Что для тебя «Успех»?",
        options: [
            { text: "Сделать открытие, которое изменит мир", type: "tech" },
            { text: "Быть полезным обществу и иметь много друзей", type: "social" },
            { text: "Оставить после себя шедевр или наследие", type: "creative" },
            { text: "Финансовая независимость и влияние", type: "business" }
        ]
    },

    // --- Блок 6 (26-30) ---
    {
        id: 26,
        text: "Какая сфера новостей тебя интересует?",
        options: [
            { text: "Наука, космос, новые гаджеты", type: "tech" },
            { text: "Общество, психология, культура", type: "social" },
            { text: "Искусство, мода, кинопремьеры", type: "creative" },
            { text: "Курсы валют, политика, стартапы", type: "business" }
        ]
    },
    {
        id: 27,
        text: "Тебе нужно убедить человека в своей правоте. Как ты это сделаешь?",
        options: [
            { text: "Приведу факты, статистику и доказательства", type: "tech" },
            { text: "Поговорю по душам, найду компромисс", type: "social" },
            { text: "Покажу наглядный пример или метафору", type: "creative" },
            { text: "Буду настойчив, использую авторитет и выгоду", type: "business" }
        ]
    },
    {
        id: 28,
        text: "Какое хобби ты бы выбрал, если бы было время?",
        options: [
            { text: "3D-моделирование или робототехника", type: "tech" },
            { text: "Ведение блога или менторство", type: "social" },
            { text: "Фотография или гончарное дело", type: "creative" },
            { text: "Трейдинг (инвестиции) или дебаты", type: "business" }
        ]
    },
    {
        id: 29,
        text: "Если бы не работа, чем бы ты занимался всю жизнь?",
        options: [
            { text: "Изобретал бы новые штуки", type: "tech" },
            { text: "Путешествовал и знакомился с людьми", type: "social" },
            { text: "Творил (рисовал, писал, снимал)", type: "creative" },
            { text: "Управлял бы своей империей", type: "business" }
        ]
    },
    {
        id: 30,
        text: "Выбери символ, который тебе ближе всего:",
        options: [
            { text: "Шестеренка или Микросхема ⚙️", type: "tech" },
            { text: "Рукопожатие или Сердце ❤️", type: "social" },
            { text: "Палитра или Звезда 🎨", type: "creative" },
            { text: "График роста или Портфель 📈", type: "business" }
        ]
    }
];

// Описания результатов
const resultsData = {
    tech: {
        title: "IT и Инженерия 💻",
        desc: "У тебя аналитический склад ума. Тебе подойдут профессии: Программист, Инженер-нефтяник, Дата-аналитик, Робототехник.",
        entProfile: ["Математика (профильная)", "Информатика"],
        entName: "Математика - Информатика"
    },
    social: {
        title: "Социальная сфера и Люди 🤝",
        desc: "Ты умеешь находить общий язык с людьми. Твой путь: Психолог, Педагог, Журналист, HR-менеджер, Врач.",
        entProfile: ["Биология", "География"],
        entName: "Биология - География"
    },
    creative: {
        title: "Творчество и Дизайн 🎨",
        desc: "Ты видишь мир нестандартно. Рассмотри профессии: Графический дизайнер, Архитектор, Маркетолог, Режиссер.",
        entProfile: ["История Казахстана", "Грамотность чтения"],
        entName: "Творческий экзамен"
    },
    business: {
        title: "Бизнес и Управление 💼",
        desc: "Ты прирожденный лидер. Тебе подойдут: Менеджмент, Логистика, Финансы, Предпринимательство, Юриспруденция.",
        entProfile: ["Математика (профильная)", "География"],
        entName: "Математика - География"
    }
};

// --- 2. ПЕРЕМЕННЫЕ СОСТОЯНИЯ ---
let currentQuestionIndex = 0;
let scores = { tech: 0, social: 0, creative: 0, business: 0 };

// --- 3. ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener('DOMContentLoaded', () => {
    // Проверка на авторизацию (если нужно)
    if(typeof checkAuth === 'function') {
        if(!localStorage.getItem('isLoggedIn')) window.location.href = 'index.html';
    }
    
    loadQuestion();
});

// --- 4. ФУНКЦИИ ---

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    const grid = document.getElementById('answers-grid');
    const nextBtn = document.getElementById('next-btn');
    
    // Обновляем текст и прогресс
    document.getElementById('question-text').innerText = question.text;
    document.getElementById('question-counter').innerText = `Вопрос ${currentQuestionIndex + 1} из ${questions.length}`;
    
    const percent = ((currentQuestionIndex) / questions.length) * 100;
    document.getElementById('progress-bar').style.width = `${percent}%`;
    document.getElementById('progress-percent').innerText = `${Math.round(percent)}%`;

    // Очищаем старые ответы
    grid.innerHTML = '';
    nextBtn.classList.add('hidden'); // Скрываем кнопку "Далее"

    // Генерируем кнопки ответов
    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = "w-full text-left p-4 rounded-xl border-2 border-transparent bg-slate-100 dark:bg-white/10 hover:border-indigo-500 hover:bg-white dark:hover:bg-white/20 transition-all font-semibold flex items-center gap-3 group";
        btn.onclick = () => selectOption(btn, option.type);
        
        btn.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-white dark:bg-black/20 flex items-center justify-center text-slate-400 font-bold text-sm group-hover:bg-indigo-500 group-hover:text-white transition">
                ${['A', 'B', 'C', 'D'][index]}
            </div>
            <span>${option.text}</span>
        `;
        
        grid.appendChild(btn);
    });
}

function selectOption(selectedBtn, type) {
    // Убираем выделение со всех кнопок
    const buttons = document.getElementById('answers-grid').children;
    for (let btn of buttons) {
        btn.classList.remove('border-indigo-500', 'bg-white', 'dark:bg-white/20', 'ring-2', 'ring-indigo-500/30');
        btn.classList.add('border-transparent');
    }

    // Подсвечиваем выбранную
    selectedBtn.classList.remove('border-transparent');
    selectedBtn.classList.add('border-indigo-500', 'bg-white', 'dark:bg-white/20', 'ring-2', 'ring-indigo-500/30');

    // Показываем кнопку "Далее"
    const nextBtn = document.getElementById('next-btn');
    nextBtn.classList.remove('hidden');
    nextBtn.onclick = () => nextQuestion(type);
}

function nextQuestion(selectedType) {
    // Записываем балл
    scores[selectedType]++;

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        // Следующий вопрос
        loadQuestion();
    } else {
        // Конец теста
        showResults();
    }
}

function showResults() {
    // Скрываем тест, показываем результат
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('result-container').classList.remove('hidden');

    // Вычисляем победителя
    // Это находит ключ (например, 'tech') с максимальным значением
    const winnerType = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const result = resultsData[winnerType];

    document.getElementById('result-title').innerText = result.title;
    document.getElementById('result-desc').innerText = result.desc;
    
    // Заполняем прогресс бар до 100%
    document.getElementById('progress-bar').style.width = '100%';
    document.getElementById('progress-percent').innerText = '100%';

    // Сохраняем результат в профиль пользователя
    localStorage.setItem('userProfession', result.title);
    localStorage.setItem('userEntProfileName', result.entName || "Не выбран");
    localStorage.setItem('userEntProfile', JSON.stringify(result.entProfile || []));
}

function restartTest() {
    currentQuestionIndex = 0;
    scores = { tech: 0, social: 0, creative: 0, business: 0 };
    document.getElementById('result-container').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    loadQuestion();
}
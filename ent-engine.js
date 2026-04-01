/**
 * EDUPATH AI - Движок ЕНТ
 */

// --- 1. ПЕРЕМЕННЫЕ СОСТОЯНИЯ ---
let subjectsDB = {}; // Будет наполняться из API
let currentQueue = []; // Очередь предметов ['history', 'reading', ...]
let currentSubjectIndex = 0;
let currentQuestionIndex = 0;
let userScore = {}; // { history: 2, math: 5 ... }
let totalQuestions = 0;
let timerInterval;

// --- 2. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

async function fetchQuestions(subjectName) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/content/questions/${encodeURIComponent(subjectName)}`);
        let questions = await response.json();
        
        // Перемешиваем сами вопросы для случайного порядка
        questions.sort(() => 0.5 - Math.random());
        
        // Ограничиваем количество вопросов согласно стандартам ЕНТ
        let limit = 40; // Профильные предметы
        if (subjectName === "История Казахстана") limit = 20;
        if (subjectName === "Математическая грамотность") limit = 10;
        if (subjectName === "Грамотность чтения") limit = 10;
        
        questions = questions.slice(0, limit);
        
        // Мапим формат БД и перемешиваем варианты ответов
        return {
            name: subjectName,
            questions: questions.map(q => {
                // Привязываем индекс к тексту ответа, чтобы знать, какой был правильным
                let optionsData = (q.options || []).map((opt, idx) => ({ 
                    text: opt, 
                    isCorrect: idx === q.correctAnswer 
                }));
                
                // Перемешиваем варианты
                optionsData.sort(() => 0.5 - Math.random());
                
                // Находим новый индекс правильного ответа
                let newCorrectIndex = optionsData.findIndex(opt => opt.isCorrect);
                
                return {
                    t: q.text,
                    o: optionsData.map(opt => opt.text),
                    a: newCorrectIndex !== -1 ? newCorrectIndex : 0
                };
            })
        };
    } catch (err) {
        console.error("Fetch error:", err);
        return { name: subjectName, questions: [] };
    }
}

// --- 3. ФУНКЦИИ ЗАПУСКА ---

// Запуск полной симуляции (5 предметов)
async function startFullExam(profilePair) {
    let profilesInfo = [];
    if(profilePair === 'math_info') profilesInfo = ["Математика (профильная)", "Информатика"];
    if(profilePair === 'math_phys') profilesInfo = ["Математика (профильная)", "Физика"];
    if(profilePair === 'chem_bio') profilesInfo = ["Химия", "Биология"];

    const obligatoryNames = ["История Казахстана", "Грамотность чтения", "Математическая грамотность"];
    const allNames = [...obligatoryNames, ...profilesInfo];

    // Загружаем данные для всех предметов
    showLoading();
    subjectsDB = {};
    for (const name of allNames) {
        subjectsDB[name] = await fetchQuestions(name);
    }
    
    currentQueue = allNames;
    initExam();
}

// Запуск одного предмета
async function startSingleExam(subjectName) {
    showLoading();
    subjectsDB = {};
    subjectsDB[subjectName] = await fetchQuestions(subjectName);
    currentQueue = [subjectName];
    initExam();
}

function showLoading() {
    document.getElementById('selection-screen').innerHTML = `
        <div class="flex flex-col items-center justify-center py-40 animate-pulse">
            <div class="animate-spin text-5xl mb-4 text-indigo-600">⌛</div>
            <p class="font-bold text-slate-500">Загрузка вопросов ЕНТ 2026...</p>
        </div>
    `;
}

// Проверка параметра URL при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const subject = params.get('subject');
    if (subject) {
        startSingleExam(subject);
    }
});

function initExam() {
    // Сброс переменных
    currentSubjectIndex = 0;
    currentQuestionIndex = 0;
    userScore = {};
    currentQueue.forEach(subj => userScore[subj] = 0);
    
    // Переключение экранов
    document.getElementById('selection-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    document.getElementById('quiz-screen').classList.add('animate-fade-in');

    // Запуск таймера (20 минут для демо)
    startTimer(20 * 60);
    
    // Загрузка первого вопроса
    loadQuestion();
}

// --- 4. ЛОГИКА ТЕСТА ---

function loadQuestion() {
    const subjKey = currentQueue[currentSubjectIndex];
    const subjectData = subjectsDB[subjKey];
    
    // Если в этом предмете кончились вопросы -> переходим к следующему предмету
    if (currentQuestionIndex >= subjectData.questions.length) {
        currentSubjectIndex++;
        currentQuestionIndex = 0;
        
        // Если предметы кончились -> КОНЕЦ ТЕСТА
        if (currentSubjectIndex >= currentQueue.length) {
            finishExam();
            return;
        }
        // Рекурсивно загружаем вопрос следующего предмета
        loadQuestion();
        return;
    }

    const q = subjectData.questions[currentQuestionIndex];

    // Обновляем UI
    document.getElementById('current-subject-name').innerText = subjectData.name;
    document.getElementById('question-counter').innerText = `Вопрос ${currentQuestionIndex + 1}`;
    document.getElementById('question-text').innerText = q.t;
    
    const grid = document.getElementById('options-grid');
    grid.innerHTML = '';
    document.getElementById('next-btn').classList.add('hidden');

    // Рендер ответов
    q.o.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.className = "w-full text-left p-4 rounded-xl border-2 border-transparent bg-slate-100 dark:bg-white/10 hover:border-indigo-500 transition font-medium";
        btn.innerText = optText;
        btn.onclick = () => selectAnswer(btn, idx, q.a);
        grid.appendChild(btn);
    });
}

function selectAnswer(btn, userIdx, correctIdx) {
    // Блокируем все кнопки
    const grid = document.getElementById('options-grid');
    const buttons = grid.children;
    for(let b of buttons) b.disabled = true;

    // Проверка
    if (userIdx === correctIdx) {
        btn.classList.add('bg-green-100', 'border-green-500', 'text-green-700', 'dark:bg-green-900/30', 'dark:text-green-400');
        // Добавляем балл текущему предмету
        const subjKey = currentQueue[currentSubjectIndex];
        userScore[subjKey]++;
    } else {
        btn.classList.add('bg-red-100', 'border-red-500', 'text-red-700', 'dark:bg-red-900/30', 'dark:text-red-400');
        // Подсвечиваем правильный
        buttons[correctIdx].classList.add('bg-green-100', 'border-green-500', 'dark:bg-green-900/30');
    }

    document.getElementById('next-btn').classList.remove('hidden');
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

// --- 5. ФИНИШ И ТАЙМЕР ---

function startTimer(duration) {
    let timer = duration, minutes, seconds;
    const display = document.getElementById('timer');
    
    clearInterval(timerInterval); // Очистка старого таймера
    
    timerInterval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            finishExam();
        }
    }, 1000);
}

function finishExam() {
    clearInterval(timerInterval);
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');

    const details = document.getElementById('score-details');
    details.innerHTML = '';
    
    let totalScore = 0;
    
    // Вывод результатов по предметам
    currentQueue.forEach(subjKey => {
        const score = userScore[subjKey];
        const max = subjectsDB[subjKey].questions.length;
        totalScore += score;
        
        const div = document.createElement('div');
        div.className = "glass p-4 rounded-xl flex justify-between items-center bg-white dark:bg-white/5";
        div.innerHTML = `
            <span class="font-bold text-slate-600 dark:text-gray-300">${subjectsDB[subjKey].name}</span>
            <span class="font-black text-indigo-600 dark:text-indigo-400 text-lg">${score} / ${max}</span>
        `;
        details.appendChild(div);
    });

    // Сохранение в профиль
    localStorage.setItem('lastEntScore', totalScore);
}

function quitExam() {
    if(confirm('Вы уверены, что хотите прервать тест?')) {
        location.reload();
    }
}
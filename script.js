/**
 * EDUPATH AI - ПОЛНЫЙ КОНТРОЛЛЕР ИНТЕРФЕЙСА
 */

// --- 1. УПРАВЛЕНИЕ ТЕМАМИ (Dark/Light Mode) ---

function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');

    if (html.classList.contains('dark')) {
        // Переход в СВЕТЛУЮ тему
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        updateThemeIcon(false);
    } else {
        // Переход в ТЕМНУЮ тему
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon(true);
    }
}

function updateThemeIcon(isDark) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
        if (isDark) {
            // В темной теме показываем солнце (чтобы включить свет)
            icon.className = 'fas fa-sun text-yellow-400 relative z-10';
        } else {
            // В светлой теме показываем луну (чтобы включить тьму)
            icon.className = 'fas fa-moon text-indigo-600 relative z-10';
        }
    }
}

// Инициализация темы при каждой загрузке страницы
(function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const html = document.documentElement;
    
    // Проверка сохраненных настроек или системных предпочтений
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (shouldBeDark) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    // Ждем полной загрузки DOM, чтобы обновить иконку в навигации
    document.addEventListener('DOMContentLoaded', () => {
        updateThemeIcon(shouldBeDark);
    });
})();


// --- 2. РЕГИСТРАЦИЯ И ВСПЛЫВАЮЩИЕ УВЕДОМЛЕНИЯ ---

function handleRegistration(event) {
    event.preventDefault(); // Запрещаем обычную перезагрузку формы

    // Сохраняем "сигнал" для главной страницы
    localStorage.setItem('registrationSuccess', 'true');

    // Перенаправляем пользователя на главную
    window.location.href = 'index.html';
}

// Проверка сигнала регистрации при загрузке любой страницы (особенно главной)
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('registrationSuccess') === 'true') {
        showToast("Вы успешно зарегистрировались! 🎉");
        localStorage.removeItem('registrationSuccess'); // Очищаем сигнал
    }
});

// Функция создания красивого уведомления (Toast)
function showToast(message) {
    const toast = document.createElement('div');
    // Стили для уведомления (совместимы с обеими темами)
    toast.className = "fixed top-10 left-1/2 -translate-x-1/2 z-[100] glass p-6 rounded-2xl shadow-2xl border-2 border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center gap-4 animate-fade-in font-bold";
    toast.innerHTML = `
        <div class="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white">
            <i class="fas fa-check"></i>
        </div>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);

    // Плавно удаляем через 4 секунды
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -20px)';
        toast.style.transition = 'all 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}


// --- 3. ЛОГИКА ИИ-АССИСТЕНТА (ЧАТ) ---

function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow) {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            const input = chatWindow.querySelector('input');
            if (input) input.focus();
        }
    }
}

// --- НОВАЯ ФУНКЦИЯ: МОБИЛЬНОЕ МЕНЮ ---
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.classList.add('flex');
        document.body.style.overflow = 'hidden'; // prevent scroll behind
    } else {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
        document.body.style.overflow = '';
    }
}

// Элементы чата
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.querySelector('#chat-window input');
    const sendBtn = document.querySelector('#chat-window button');
    
    if (chatInput && sendBtn) {
        // Отправка по нажатию Enter
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUserMessage();
        });

        // Отправка по клику на иконку
        sendBtn.addEventListener('click', handleUserMessage);
    }
});

async function handleUserMessage() {
    const chatInput = document.querySelector('#chat-window input');
    const text = chatInput.value.trim();
    
    if (!text) return;

    // Идентификатор чата для поддержания истории на сервере.
    // Храним в localStorage, чтобы диалог не сбрасывался при перезагрузке страницы.
    let chatId = localStorage.getItem('qadam_chat_id');
    if (!chatId) {
        chatId = (window.crypto && crypto.randomUUID)
            ? crypto.randomUUID()
            : (`${Date.now()}_${Math.random().toString(16).slice(2)}`);
        localStorage.setItem('qadam_chat_id', chatId);
    }

    // Убеждаемся, что окно чата на мобильных не слишком узкое ( Tailwind w-85 — ошибка, исправляем на w-[calc(100%-2rem)] )
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow && !chatWindow.classList.contains('md:w-96')) {
        chatWindow.classList.add('w-[calc(100%-2rem)]', 'md:w-96');
    }

    const sendBtn = document.querySelector('#chat-window button');
    if (sendBtn) sendBtn.disabled = true;
    if (chatInput) chatInput.disabled = true;

    // 1. Добавляем сообщение пользователя
    addMessage('user', text);
    chatInput.value = ""; // Очистка

    // 2. Добавляем индикатор загрузки ("печатает...")
    const loadingId = addMessage('ai', "ИИ думает...", true);

    try {
        // 3. Отправляем запрос на бэкенд
        const response = await fetch('http://127.0.0.1:5000/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-chat-id': chatId },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json().catch(() => ({}));
        
        // Удаляем индикатор загрузки
        removeMessage(loadingId);

        const aiText = data && data.response
            ? data.response
            : ("❌ Ошибка: " + (data.error || "Не удалось получить ответ. Проверь запущен ли бэкенд!"));
        addMessage('ai', aiText);
    } catch (error) {
        removeMessage(loadingId);
        addMessage('ai', "❌ Ошибка соединения. Убедись, что сервер 127.0.0.1:5000 запущен.");
        console.error("Chat Error:", error);
    } finally {
        if (sendBtn) sendBtn.disabled = false;
        if (chatInput) chatInput.disabled = false;
    }
}

let messageCounter = 0;

function addMessage(sender, text, isLoading = false) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    messageCounter++;
    const msgId = `msg-${messageCounter}`;
    const msg = document.createElement('div');
    msg.id = msgId;
    
    if (sender === 'user') {
        msg.className = "bg-indigo-100 dark:bg-white/10 p-3 rounded-2xl rounded-tr-none text-xs ml-auto max-w-[85%] border border-indigo-200 dark:border-white/5 dark:text-white animate-fade-in";
    } else {
        msg.className = "bg-indigo-600 text-white p-3 rounded-2xl rounded-tl-none text-xs shadow-md max-w-[85%] animate-fade-in";
        if (isLoading) {
            msg.classList.add('animate-pulse');
        }
    }

    msg.textContent = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
    
    return msgId;
}

function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

/**
 * EDUPATH AI - ПОЛНЫЙ КОНТРОЛЛЕР С ЗАЩИТОЙ ДОСТУПА
 */

// --- 1. ПРОВЕРКА ДОСТУПА (ВРЕМЕННО ОТКЛЮЧЕНО) ---
function checkAuth(targetPage) {
    // Временно разрешаем переход на любые страницы без проверки
    window.location.href = targetPage;
}

// --- 2. РЕГИСТРАЦИЯ ---
function handleRegistration(event) {
    event.preventDefault();
    
    // Имитация сохранения данных
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('registrationSuccess', 'true');
    
    // После регистрации — на главную
    window.location.href = 'index.html'; 
}

// --- 3. УВЕДОМЛЕНИЯ (TOAST) ---
function showToast(message) {
    // Удаляем старые тосты, если они есть, чтобы не спамить
    const oldToast = document.querySelector('.toast-msg');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = "toast-msg fixed top-10 left-1/2 -translate-x-1/2 z-[100] glass p-6 rounded-2xl shadow-2xl border-2 border-orange-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center gap-4 animate-fade-in font-bold";
    toast.innerHTML = `
        <div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
            <i class="fas fa-lock"></i>
        </div>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -20px)';
        toast.style.transition = 'all 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// --- 4. ТЕМЫ И ИКОНКИ ---
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.className = isDark ? 'fas fa-sun text-yellow-400 relative z-10' : 'fas fa-moon text-indigo-600 relative z-10';
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Проверка темы
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) document.documentElement.classList.add('dark');
    updateThemeIcon(isDark);

    // Проверка успешной регистрации
        if (localStorage.getItem('registrationSuccess') === 'true') {
            showToast("Добро пожаловать в EduPath! 🎉");
            localStorage.removeItem('registrationSuccess');
        }

    // Загружаем предметы для главной страницы
    if (typeof loadSubjects === 'function') {
        loadSubjects();
    }

    // Обновляем UI навигации (Вход / Личный кабинет)
    updateNavUI();
});

// --- НОВАЯ ФУНКЦИЯ: ДИНАМИЧЕСКАЯ НАВИГАЦИЯ (ВРЕМЕННО СКРЫВАЕМ ВСЕ) ---
function updateNavUI() {
    console.log('--- AUTH BYPASS ACTIVE ---');
    // Скрываем все элементы, связанные с авторизацией
    const authElements = [
        'nav-login-btn', 
        'nav-profile-btn', 
        'mobile-login-btn', 
        'mobile-profile-btn'
    ];
    
    authElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('hidden');
            el.style.display = 'none'; // Принудительно через style
        }
    });
}

// --- 5. ЧАТ ---
// Финальное удаление дубликата toggleChat (он теперь выше)

// --- ЛОГИКА ВХОДА (LOGIN) ---

// (Дубликат handleLogin удален, используем актуальную версию ниже)

// Добавляем проверку для уведомления "С возвращением" в существующий слушатель
document.addEventListener('DOMContentLoaded', () => {
    
    // ... тут твой старый код проверки регистрации ...

    // Проверка успешного ВХОДА
    if (localStorage.getItem('loginSuccess') === 'true') {
        showToast("С возвращением! Мы скучали 👋");
        localStorage.removeItem('loginSuccess');
    }
});

// --- ЛОГИКА СБРОСА ПАРОЛЯ (RESET) ---

// Этап 1: Проверка почты
function handleResetCheck(event) {
    event.preventDefault();
    
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const btn = step1.querySelector('button');

    // 1. Анимация загрузки на кнопке
    const originalText = btn.innerText;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Проверка...';
    btn.classList.add('opacity-70', 'cursor-not-allowed');

    // 2. Имитация поиска в базе данных (1.5 секунды)
    setTimeout(() => {
        // Скрываем первый этап (уезжает влево)
        step1.classList.add('-translate-x-full', 'opacity-0');
        
        setTimeout(() => {
            step1.classList.add('hidden');
            
            // Показываем второй этап
            step2.classList.remove('hidden');
            // Небольшая задержка чтобы браузер понял, что display изменился, перед анимацией прозрачности
            setTimeout(() => {
                step2.classList.remove('opacity-0', 'translate-x-20');
            }, 50);
            
        }, 500); // Ждем пока закончится анимация исчезновения
        
        showToast("Мы нашли ваш аккаунт! 🟢");
    }, 1500);
}

// Этап 2: Сохранение нового пароля
function handleNewPassword(event) {
    event.preventDefault();
    
    // Имитация сохранения
    showToast("Пароль успешно изменен! 🔒");
    
    // Перенаправление на вход через 2 секунды
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// (Дубликат handleRegistration удален, используем актуальную версию ниже)


// --- 2. ФУНКЦИЯ ВЫХОДА (LOGOUT) ---
function handleLogout() {
    if(confirm("Точно хочешь выйти?")) {
        // Очищаем ВСЕ данные сессии
        localStorage.removeItem('qadam_token');
        localStorage.removeItem('user_info');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userProfession');
        localStorage.removeItem('lastEntScore');
        
        window.location.href = 'index.html';
    }
}


// --- 3. ЗАЩИТА СТРАНИЦЫ ПРОФИЛЯ ---
if (window.location.pathname.includes('profile.html')) {
    const token = localStorage.getItem('qadam_token');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    // Если нет ни токена, ни флага логина — возвращаем на вход
    if (!token && !isLoggedIn) {
        window.location.href = 'login.html';
    }
}

async function handleRegistration(event) {
    event.preventDefault(); // Чтобы страница не перезагружалась

    // Собираем данные
    const username = document.getElementById('username').value;
    const city = document.getElementById('city').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, city })
        });

        const data = await response.json();

        if (response.ok) {
            alert('🚀 Успешно! Ты зарегистрирован в Qadam.');
            window.location.href = 'login.html'; // Переходим на вход
        } else {
            alert('❌ Ошибка: ' + (data.msg || 'Попробуй еще раз'));
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('❌ Сервер не отвечает. Проверь терминал с node server.js');
    }
}


// Функция входа для Qadam
async function handleLogin(event) {
    // 1. ОСТАНАВЛИВАЕМ ОБНОВЛЕНИЕ СТРАНИЦЫ
    event.preventDefault(); 
    
    console.log("🚀 Попытка входа в систему...");

    // 2. Получаем данные
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    if (!emailInput || !passwordInput) {
        console.error("❌ Ошибка: Не найдены поля ввода (проверь ID в HTML)");
        return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Сохраняем токен и инфо о пользователе
            localStorage.setItem('qadam_token', data.token);
            localStorage.setItem('user_info', JSON.stringify(data.user));
            localStorage.setItem('isLoggedIn', 'true'); // Для совместимости со старым кодом
            localStorage.setItem('loginSuccess', 'true'); // Для показа уведомления на главной

            alert('🚀 С возвращением в Qadam!');
            // Переходим на ГЛАВНУЮ по просьбе пользователя
            window.location.href = 'index.html'; 
        } else {
            alert('❌ Ошибка: ' + (data.msg || 'Неверный email или пароль'));
        }
    } catch (error) {
        console.error("Ошибка сети:", error);
        alert('❌ Сервер не отвечает. Убедись, что бэкенд запущен!');
    }
}

// Ждем загрузки, чтобы найти элементы
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const statusText = document.getElementById('password-status');

    if (passwordInput && statusText) {
        passwordInput.addEventListener('input', () => {
            const val = passwordInput.value;
            
            // Регулярное выражение: 8+ символов, заглавная, цифра
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

            if (val.length === 0) {
                statusText.textContent = '';
            } else if (regex.test(val)) {
                statusText.textContent = '✅ Надежный пароль';
                statusText.style.color = '#22c55e'; // Зеленый (Tailwind green-500)
            } else {
                statusText.textContent = '❌ Минимум 8 символов, заглавная буква и цифра';
                statusText.style.color = '#ef4444'; // Красный (Tailwind red-500)
            }
        });
    }
});

async function loadSubjects() {
    const container = document.getElementById('subjects-container');
    if (!container) return;

    // Показываем Spinner (Загрузка)
    container.innerHTML = '<div class="animate-spin text-4xl text-indigo-600">⌛</div>';

    try {
        const res = await fetch('http://127.0.0.1:5000/api/content/subjects');
        const subjects = await res.json();

        container.innerHTML = ''; // Очищаем спиннер

        subjects.forEach(sub => {
            container.innerHTML += `
                <div onclick="window.location.href='ent.html?subject=${sub.name}'" 
                     class="glass p-8 rounded-[2rem] border border-gray-200 dark:border-white/10 hover:border-indigo-500/50 hover:scale-105 transition-all cursor-pointer group bg-white/40 dark:bg-white/5 shadow-lg shadow-indigo-500/5">
                    <div class="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:bg-indigo-500 transition-all duration-300">
                        ${sub.icon}
                    </div>
                    <h3 class="text-xl font-extrabold mb-2 dark:text-white">${sub.name}</h3>
                    <p class="text-xs font-bold text-slate-400 group-hover:text-indigo-500 transition-colors uppercase tracking-wider">${sub.count} вопросов</p>
                </div>
            `;
        });
    } catch (err) {
        container.innerHTML = '<p class="text-red-500">Ошибка загрузки данных</p>';
    }
}

// Функция для защиты страниц (ОТКЛЮЧЕНО ДЛЯ ТЕСТОВ)
function protectPage() {
    return; // Разрешаем доступ ко всем страницам
}

// Проверка: является ли текущий пользователь администратором
function isAdmin() {
    const token = localStorage.getItem('qadam_token');
    if (!token) return false;
    try {
        const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
        return userInfo.role === 'admin';
    } catch (e) {
        return false;
    }
}

// Показать блок «Добавить ВУЗ» только администратору
document.addEventListener('DOMContentLoaded', function() {
    var adminBlock = document.getElementById('adminAddUni');
    if (adminBlock && typeof isAdmin === 'function' && isAdmin()) {
        adminBlock.classList.remove('hidden');
    }
});

// Запускаем проверку сразу при загрузке
document.addEventListener('DOMContentLoaded', protectPage);

function loadUserProfile() {
    if (window.location.pathname.includes('profile.html')) {
        const userInfo = JSON.parse(localStorage.getItem('user_info'));
        
        if (userInfo) {
            // Вставляем имя пользователя в HTML (убедись, что есть элемент с id="userName")
            const nameElement = document.getElementById('userName');
            const cityElement = document.getElementById('userCity');

            if (nameElement) nameElement.textContent = userInfo.username;
            if (cityElement) cityElement.textContent = userInfo.city || 'Атырау';
        }
    }
}

document.addEventListener('DOMContentLoaded', loadUserProfile);

function handleLogout() {
    localStorage.removeItem('qadam_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('isLoggedIn'); // Очищаем и старый флаг
    
    // Обновляем UI (если мы на той же странице)
    updateNavUI();

    alert('Ты вышел из системы. Удачи в подготовке!');
    window.location.href = 'index.html';
}


function setSearch(text) {
    const input = document.getElementById('searchInput');
    const citySelect = document.getElementById('cityFilter');

    if (text === 'Атырау') {
        citySelect.value = 'АТЫРАУ'; // Переключаем город в списке
        input.value = '';            // Очищаем текст
    } else {
        input.value = text;          // Для "IT" или "Нефть" пишем в поиск
    }
    
    // `filterUniversities()` определён только на странице `universities.html`,
    // поэтому безопасно проверяем, существует ли функция.
    if (typeof filterUniversities === 'function') {
        filterUniversities(); // Запускаем фильтр
    }
}

// Запускаем фильтр при загрузке страницы
window.onload = function() {
    if (typeof filterUniversities === 'function') {
        filterUniversities();
    }
};
# 🎓 QADAM.AI — Твой ИИ-гид по поступлению

> **Персональный AI-помощник для абитуриентов Казахстана.**  
> Профориентация, тренажёр ЕНТ, база ВУЗов и калькулятор грантов — всё в одном месте.

---

## 📌 О проекте

**QADAM.AI** — это образовательная веб-платформа для школьников и абитуриентов Казахстана (г. Атырау и вся РК). Платформа объединяет нейросети, актуальную базу университетов и интерактивный тренажёр ЕНТ, чтобы помочь каждому ученику выбрать профессию и успешно поступить.

---

## 🚀 Функциональность

| Модуль | Описание |
|---|---|
| 🤖 **AI Профориентация** | Нейросеть анализирует склонности и подбирает профессию будущего |
| 📝 **Тренажёр ЕНТ** | Интерактивные тесты с объяснением ошибок, подготовка к баллу 140+ |
| 🏛️ **База ВУЗов РК** | Поиск университетов по городу, специальности и проходному баллу |
| 🧮 **Калькулятор грантов** | Расчёт шансов на получение гранта по результатам ЕНТ |
| 💬 **AI Ассистент** | Чат-бот на базе OpenRouter (Gemma 3 27B), помогает в навигации по платформе |
| 👤 **Личный кабинет** | Регистрация, авторизация, профиль пользователя с аватаром и избранными ВУЗами |

---

## 🗂️ Структура проекта

```
qadam.ai2/
│
├── 📄 index.html          # Главная страница
├── 📄 test.html           # Профориентационный тест (AI)
├── 📄 ent.html            # Тренажёр ЕНТ
├── 📄 universities.html   # Каталог ВУЗов Казахстана
├── 📄 university.html     # Страница одного ВУЗа
├── 📄 grant.html          # Калькулятор грантов
├── 📄 profile.html        # Личный кабинет
├── 📄 login.html          # Страница входа
├── 📄 register.html       # Страница регистрации
├── 📄 reset.html          # Сброс пароля
├── 📄 add-university.html # Добавление ВУЗа (admin)
│
├── 📜 script.js           # Главный JS (тема, авторизация, chat)
├── 📜 ent-engine.js       # Движок тренажёра ЕНТ
├── 🎨 style.css           # Глобальные стили (glassmorphism)
│
└── 📁 backend/            # Node.js сервер
    ├── server.js          # Точка входа Express
    ├── .env               # Переменные среды (не в git!)
    │
    ├── 📁 routes/
    │   ├── auth.js        # Регистрация / вход / JWT
    │   ├── user.js        # Профиль, аватар, избранное
    │   ├── content.js     # Вопросы ЕНТ и предметы
    │   ├── universities.js# CRUD для ВУЗов
    │   └── ai.js          # AI-чат через OpenRouter API
    │
    ├── 📁 models/
    │   ├── User.js        # Схема пользователя (Mongoose)
    │   ├── University.js  # Схема университета
    │   ├── Question.js    # Схема вопроса ЕНТ
    │   └── test.js        # Схема результатов теста
    │
    ├── 📁 data/
    │   └── ent_questions.json  # База вопросов ЕНТ
    │
    ├── 📁 middleware/     # JWT-авторизация
    ├── 📁 services/       # Вспомогательные сервисы
    └── 📁 uploads/        # Загруженные аватары пользователей
```

---

## 🛠️ Технологический стек

### Frontend
- **HTML5** + **TailwindCSS** (CDN)
- **Font Awesome** — иконки
- **Google Fonts** — Plus Jakarta Sans
- Glassmorphism UI, dark mode, адаптивная вёрстка

### Backend
- **Node.js** + **Express.js v5**
- **MongoDB** + **Mongoose** — база данных
- **JWT** (`jsonwebtoken`) — авторизация
- **bcryptjs** — хэширование паролей
- **Multer** — загрузка файлов (аватары)
- **OpenRouter API** (модель: `google/gemma-3-27b-it:free`) — AI чат

---

## ⚙️ Установка и запуск

### Требования
- Node.js ≥ 18
- MongoDB (локально или MongoDB Atlas)
- Ключи API: `OPENROUTER_API_KEY`, `MONGO_URI`, `JWT_SECRET`

### 1. Клонировать репозиторий

```bash
git clone https://github.com/kenesbaevdaniar/Qadam-AI.git
cd Qadam-AI
```

### 2. Настроить переменные среды

Создайте файл `backend/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/qadam
JWT_SECRET=your_super_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=google/gemma-3-27b-it:free
PORT=5000
```

### 3. Установить зависимости и запустить backend

```bash
cd backend
npm install
node server.js
```

Сервер запустится на `http://localhost:5000`

### 4. Открыть frontend

Открыть `index.html` в браузере напрямую **или** через Live Server (VS Code).

> ⚠️ Убедитесь, что в `script.js` и других JS-файлах URL API указывает на `http://localhost:5000`.

### 5. (Опционально) Заполнить базу данных

```bash
cd backend
node seed_universities.js   # Загрузить ВУЗы
node seed_questions.js      # Загрузить вопросы ЕНТ
node seed_admin.js          # Создать аккаунт администратора
```

---

## 🔌 API Endpoints

| Метод | URL | Описание |
|---|---|---|
| `POST` | `/api/auth/register` | Регистрация |
| `POST` | `/api/auth/login` | Вход |
| `GET` | `/api/user/profile` | Профиль (JWT) |
| `PATCH` | `/api/user/avatar` | Загрузка аватара |
| `GET` | `/api/universities` | Список ВУЗов |
| `GET` | `/api/universities/:id` | Один ВУЗ |
| `GET` | `/api/content/subjects` | Предметы ЕНТ |
| `GET` | `/api/content/questions/:subject` | Вопросы по предмету |
| `POST` | `/api/ai/chat` | AI Ассистент |

---

## 📱 Страницы платформы

- **/** `index.html` — Главная с hero-секцией, фичами и AI-чатом
- **/test** `test.html` — Профориентационный AI-тест
- **/ent** `ent.html` — Тренажёр ЕНТ с выбором предмета и таймером
- **/universities** `universities.html` — Каталог с поиском и фильтрами
- **/grant** `grant.html` — Калькулятор шансов на грант
- **/profile** `profile.html` — Личный кабинет и настройки

---

## 🌟 Особенности

- 🌙 **Dark / Light mode** — авто-переключение темы
- 🔒 **JWT авторизация** — защищённые маршруты
- 🤖 **AI-чат** — контекстный чат-ассистент с историей диалога
- 📊 **Калькулятор грантов** — анализ по баллу ЕНТ и специальности
- 🖼️ **Загрузка аватаров** — хранение на сервере через Multer

---

## 👥 Команда

- **Daniar Kenesbaev** — Full-stack разработчик  
- Проект разработан в г. **Атырау**, Казахстан 🇰🇿

---

## 📄 Лицензия

MIT License © 2025 QADAM.AI

---

<div align="center">
  <b>QADAM.AI</b> — Твоя карьера начинается с ИИ 🚀
</div>


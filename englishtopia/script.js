// Конфигурация приложения
const CONFIG = {
    backendPath: 'backend/',
    assetsPath: 'assets/',
    carouselSlides: [
        {
            icon: 'bi-translate',
            title: 'Английский 24/7',
            description: 'Весь день на английском: игры, общение, мероприятия и вечерние шоу'
        },
        {
            icon: 'bi-people-fill',
            title: 'Опытные педагоги',
            description: 'Создают тёплую атмосферу, даже если ребёнок только начинает учить язык'
        },
        {
            icon: 'bi-heart-fill',
            title: 'Безопасная среда',
            description: 'Забота о каждом ребёнке и комфортная атмосфера для изучения языка'
        }
    ],
    activityPhotos: [
        'activity-adventures.jpg',   // Приключенческие игры
        'activity-art.jpg',         // Творческие мастер-классы
        'activity-sports.jpg',      // Спортивные игры
        'activity-show.jpg',        // Вечерние шоу
        'activity-language.jpg',    // Языковые игры
        'activity-team.jpg'         // Команда организаторов
    ]
};

// Глобальные переменные для хранения данных
let appData = {
    info: null,
    cards: null,
    reviews: null,
    schedule: null
};

// Основная функция инициализации
document.addEventListener('DOMContentLoaded', function() {
    console.log('EnglishTopia - Загрузка данных...');

    // Загружаем все данные
    loadAllData();

    // Настройка анимаций появления
    setupScrollAnimations();

    // Настройка обработчиков событий
    setupEventListeners();

    // Настройка карусели
    setupCarousel();

    // Настройка логотипа
    setupLogo();

    // Настройка чат-бота
    setupChatBot();
});

// Настройка логотипа
function setupLogo() {
    const headerLogo = document.querySelector('.header-logo');
    const footerLogo = document.querySelector('.footer-logo');

    const logoFallback = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24"><path fill="%23ffb347" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/><circle cx="12" cy="12" r="10" fill="none" stroke="%23ff8c00" stroke-width="2"/></svg>';

    if (headerLogo) {
        headerLogo.addEventListener('error', function() {
            console.log('Ошибка загрузки логотипа, используем заглушку');
            this.src = logoFallback;
            this.style.height = '60px';
        });
    }

    if (footerLogo) {
        footerLogo.addEventListener('error', function() {
            this.src = logoFallback;
            this.style.height = '40px';
        });
    }
}

// Настройка чат-бота
function setupChatBot() {
    const toggleBtn = document.getElementById('openChatBot');
    const closeBtn = document.getElementById('closeChatBot');
    const chatBot = document.getElementById('chatBot');

    if (toggleBtn && chatBot) {
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            chatBot.classList.toggle('show');
        });
    }

    if (closeBtn && chatBot) {
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            chatBot.classList.remove('show');
        });
    }

    // Закрытие чат-бота при клике вне его
    document.addEventListener('click', function(event) {
        if (chatBot && chatBot.classList.contains('show')) {
            const isClickInside = chatBot.contains(event.target);
            const isToggleBtn = toggleBtn && toggleBtn.contains(event.target);

            if (!isClickInside && !isToggleBtn) {
                chatBot.classList.remove('show');
            }
        }
    });
}

// Загрузка всех данных
async function loadAllData() {
    try {
        console.log('Загружаем данные из JSON файлов...');

        // Загружаем все JSON файлы
        const [info, cards, reviews, schedule] = await Promise.all([
            loadJSON('info.json'),
                                                                   loadJSON('cards.json'),
                                                                   loadJSON('reviews.json'),
                                                                   loadJSON('schedule.json')
        ]);

        appData = { info, cards, reviews, schedule };
        console.log('Данные успешно загружены');

        // Рендерим все компоненты
        renderAllComponents();

    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        showErrorMessage();
    }
}

// Загрузка JSON файла
async function loadJSON(filename) {
    const response = await fetch(`${CONFIG.backendPath}${filename}`);
    if (!response.ok) {
        throw new Error(`Ошибка загрузки ${filename}: ${response.status}`);
    }
    return await response.json();
}

// Рендер всех компонентов
function renderAllComponents() {
    if (!appData.info) {
        console.error('Нет данных для рендеринга');
        return;
    }

    // Обновляем основную информацию
    updateMainInfo();

    // Рендерим карточки "Почему мы"
    renderWhyUsCards();

    // Рендерим активности с фото
    renderActivities();

    // Рендерим отзывы
    renderReviews();

    // Рендерим чат-бот FAQ
    renderChatBot();

    // Обновляем контакты в футере
    updateFooter();

    // Убираем лоадеры
    hideLoaders();
}

// Обновление основной информации
function updateMainInfo() {
    const info = appData.info;

    // Обновляем заголовки и текст
    document.getElementById('campName').textContent = info.campName;
    document.getElementById('campTagline').textContent = info.tagline;
    document.getElementById('campSubtitle').textContent = info.subtitle;
    document.getElementById('campDescription').textContent = info.description;
    document.getElementById('nextSession').textContent = `Следующая смена: ${info.nextSession}`;

    // Обновляем контакты
    document.getElementById('phone1').textContent = info.phone1;
    document.getElementById('phone2').textContent = info.phone2;
    document.getElementById('address').textContent = info.address;
    document.getElementById('email').textContent = `Email: ${info.email}`;
    document.getElementById('socialText').innerHTML = `VK: englishtopia<br>Telegram: EnglishTopiaproject`;

    // Обновляем ссылки
    document.getElementById('vkLink').href = info.vkLink;
    document.getElementById('whatsappLink').href = info.whatsappLink;
    document.getElementById('telegramLink').href = info.telegramLink;

    // Обновляем футер
    document.getElementById('footerVkLink').href = info.vkLink;
    document.getElementById('footerWhatsappLink').href = info.whatsappLink;
    document.getElementById('footerTelegramLink').href = info.telegramLink;
}

// Рендер карточек "Почему мы"
function renderWhyUsCards() {
    if (!appData.cards || !appData.cards.whyUs) return;

    const container = document.getElementById('whyUsContainer');
    const cards = appData.cards.whyUs;

    // Очищаем контейнер
    container.innerHTML = '';

    // Создаем карточки
    cards.forEach(card => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4 fade-in';

        col.innerHTML = `
        <div class="card border-0 shadow pastel-orange card-hover ${card.animation || ''} h-100">
        <div class="card-body text-center p-4">
        <div class="card-icon display-1 mb-3">
        <i class="bi ${card.icon}"></i>
        </div>
        <h4 class="card-title">${card.title}</h4>
        <p class="card-text">${card.description}</p>
        </div>
        </div>
        `;

        container.appendChild(col);
    });

    // Запускаем анимации появления
    setTimeout(() => triggerFadeInAnimations(), 100);
}

// Рендер активностей с фото - ИСПРАВЛЕННЫЙ
function renderActivities() {
    if (!appData.cards || !appData.cards.activities) return;

    const container = document.getElementById('activitiesContainer');
    const activities = appData.cards.activities;

    // Очищаем контейнер
    container.innerHTML = '';

    // Создаем карточки с фото
    activities.forEach((activity, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-sm-6 mb-4 fade-in';

        // Получаем фото для активности
        const photoPath = getActivityPhoto(index);
        const photoAlt = activity.title;

        col.innerHTML = `
        <div class="card border-0 shadow card-hover h-100 activity-card">
        <div class="activity-image-container">
        <img src="${photoPath}" alt="${photoAlt}" class="activity-image">
        </div>
        <div class="activity-content">
        <div class="card-icon mb-2">
        <i class="bi ${activity.icon} fs-2"></i>
        </div>
        <h4 class="activity-title">${activity.title}</h4>
        <p class="activity-description">${activity.description}</p>
        </div>
        </div>
        `;

        container.appendChild(col);

        // Добавляем обработчик ошибок для изображения
        const img = col.querySelector('.activity-image');
        img.addEventListener('error', function() {
            console.log(`Ошибка загрузки фото: ${photoPath}`);
            this.src = getFallbackImage(index);
        });

        // Проверяем успешную загрузку
        img.addEventListener('load', function() {
            console.log(`Фото загружено: ${photoPath}`);
        });
    });

    // Запускаем анимации появления
    setTimeout(() => triggerFadeInAnimations(), 100);
}

// Получение фото для активности
function getActivityPhoto(index) {
    if (index < CONFIG.activityPhotos.length) {
        const photoName = CONFIG.activityPhotos[index];
        return `${CONFIG.assetsPath}photos/${photoName}`;
    }
    return getFallbackImage(index);
}

// Получение заглушки для изображения
function getFallbackImage(index) {
    const activityNames = [
        'Приключенческие игры',
        'Творческие мастер-классы',
        'Спортивные игры',
        'Вечерние шоу',
        'Языковые игры',
        'Команда организаторов'
    ];

    const activityName = activityNames[index] || 'Активность';
    const activityIcons = [
        '🏕️',
        '🎨',
        '⚽',
        '🎭',
        '💬',
        '👥'
    ];
    const icon = activityIcons[index] || '🌟';

    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23ffd8b1"/><text x="50%" y="40%" font-family="Arial" font-size="36" fill="%235a3921" text-anchor="middle">${icon}</text><text x="50%" y="65%" font-family="Arial" font-size="16" fill="%235a3921" text-anchor="middle">${activityName}</text></svg>`;
}

// Рендер отзывов
function renderReviews() {
    if (!appData.reviews || !appData.reviews.reviews) return;

    const container = document.getElementById('reviewsContainer');
    const reviews = appData.reviews.reviews;

    // Очищаем контейнер
    container.innerHTML = '';

    // Создаем отзывы
    reviews.forEach(review => {
        const col = document.createElement('div');
        col.className = 'col-lg-6 mb-4 fade-in';

        col.innerHTML = `
        <div class="review-card card pastel-peach border-0 shadow-sm h-100">
        <div class="card-body p-4">
        <p class="card-text">"${review.text}"</p>
        <div class="mt-3 fw-bold">— ${review.author}</div>
        ${review.date ? `<small class="text-muted">${review.date}</small>` : ''}
        </div>
        </div>
        `;

        container.appendChild(col);
    });

    // Запускаем анимации появления
    setTimeout(() => triggerFadeInAnimations(), 100);
}

// Рендер чат-бота FAQ - ИСПРАВЛЕННЫЙ
function renderChatBot() {
    if (!appData.schedule || !appData.schedule.faq) return;

    const container = document.getElementById('chatBotBody');
    const faqItems = appData.schedule.faq;

    // Очищаем контейнер
    container.innerHTML = '';

    // Создаем вопросы для чат-бота
    faqItems.forEach((item) => {
        // Создаем кнопку с вопросом
        const questionBtn = document.createElement('button');
        questionBtn.className = 'chat-question';
        questionBtn.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
        <span>${item.question}</span>
        <i class="bi bi-chevron-right"></i>
        </div>
        `;

        questionBtn.addEventListener('click', function(e) {
            e.stopPropagation();

            // Удаляем активный класс у всех вопросов
            document.querySelectorAll('.chat-question').forEach(q => {
                q.classList.remove('active');
            });

            // Добавляем активный класс текущему вопросу
            this.classList.add('active');

            // Проверяем, есть ли уже ответ для этого вопроса
            const existingAnswer = this.nextElementSibling;

            // Если ответ уже открыт, скрываем его
            if (existingAnswer && existingAnswer.classList.contains('chat-answer')) {
                existingAnswer.remove();
                this.classList.remove('active');
                return;
            }

            // Удаляем другие открытые ответы
            document.querySelectorAll('.chat-answer').forEach(answer => {
                answer.remove();
            });

            // Создаем новый ответ
            const answerDiv = document.createElement('div');
            answerDiv.className = 'chat-answer';
            answerDiv.innerHTML = `
            <h6>${item.question}</h6>
            <p>${item.answer}</p>
            `;

            // Вставляем ответ после вопроса
            this.parentNode.insertBefore(answerDiv, this.nextSibling);

            // Прокручиваем к ответу
            setTimeout(() => {
                answerDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        });

        container.appendChild(questionBtn);
    });

    // Добавляем подсказку
    const hint = document.createElement('div');
    hint.className = 'chat-bot-hint';
    hint.innerHTML = '<i class="bi bi-info-circle me-1"></i> Нажмите на вопрос, чтобы увидеть ответ';
    container.appendChild(hint);
}

// Обновление футера
function updateFooter() {
    // Ссылки уже обновлены в updateMainInfo()
}

// Скрыть лоадеры
function hideLoaders() {
    document.querySelectorAll('.loader').forEach(loader => {
        loader.style.display = 'none';
    });

    // Скрываем тексты загрузки
    const loaders = document.querySelectorAll('#whyUsContainer > div.text-center, #activitiesContainer > div.text-center, #reviewsContainer > div.text-center');
    loaders.forEach(el => {
        el.style.display = 'none';
    });
}

// Настройка карусели (оставляем с иконками)
function setupCarousel() {
    const carouselInner = document.getElementById('carouselItems');

    // Очищаем карусель
    carouselInner.innerHTML = '';

    // Добавляем слайды с иконками
    CONFIG.carouselSlides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `carousel-item ${index === 0 ? 'active' : ''}`;

        slideDiv.innerHTML = `
        <div class="photo-placeholder">
        <i class="bi ${slide.icon} carousel-icon-lg"></i>
        <h3>${slide.title}</h3>
        <p class="text-center">${slide.description}</p>
        </div>
        `;

        carouselInner.appendChild(slideDiv);
    });
}

// Настройка анимаций при скролле
function setupScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    const appearOnScroll = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    // Немедленно показываем элементы в герое
    document.querySelectorAll('.hero-section .fade-in').forEach(el => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 300);
    });
}

// Триггер анимаций появления
function triggerFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in:not(.visible)');
    fadeElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, index * 100);
    });
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Плавная прокрутка для навигационных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Обновляем активный пункт меню
                updateActiveNavItem(targetId);

                // Закрываем мобильное меню Bootstrap, если открыто
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    });

    // Обновление активного пункта меню при скролле
    window.addEventListener('scroll', debounce(updateActiveNavOnScroll, 100));

    // Обработка кликов по социальным иконкам
    document.querySelectorAll('.social-icon').forEach(icon => {
        icon.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                window.open(href, '_blank');
            }
        });
    });

    // Обработка кликов по кнопкам телефона
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function(e) {
            // На мобильных устройствах позволим стандартное поведение
            // На десктопе покажем уведомление
            if (!isMobileDevice()) {
                e.preventDefault();
                const phoneNumber = this.getAttribute('href').replace('tel:', '');
                alert(`Позвонить по номеру: ${phoneNumber}`);
            }
        });
    });
}

// Обновление активного пункта меню
function updateActiveNavItem(targetId) {
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// Обновление активного пункта меню при скролле
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            updateActiveNavItem(`#${sectionId}`);
        }
    });
}

// Проверка мобильного устройства
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Debounce функция для оптимизации скролла
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Показ сообщения об ошибке
function showErrorMessage() {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'alert alert-warning alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3 z-3';
    errorContainer.style.maxWidth = '500px';
    errorContainer.innerHTML = `
    <i class="bi bi-exclamation-triangle me-2"></i>
    <strong>Ошибка загрузки данных</strong> Пожалуйста, проверьте подключение и перезагрузите страницу.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрыть"></button>
    `;

    document.body.appendChild(errorContainer);

    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(errorContainer);
        bsAlert.close();
    }, 5000);
}

// Инициализация карусели Bootstrap
document.addEventListener('DOMContentLoaded', function() {
    const carouselElement = document.getElementById('campCarousel');
    if (carouselElement) {
        const carousel = new bootstrap.Carousel(carouselElement, {
            interval: 4000,
            wrap: true,
            pause: 'hover',
            ride: 'carousel'
        });
    }
});

// Функция для проверки загрузки фото
function checkPhotosLoaded() {
    console.log('Проверка загрузки фото...');

    setTimeout(() => {
        const activityImages = document.querySelectorAll('.activity-image');
        let loaded = 0;
        let failed = 0;

        activityImages.forEach((img, index) => {
            if (img.complete && img.naturalHeight !== 0) {
                loaded++;
                console.log(`✓ Фото активности ${index + 1} загружено: ${img.src}`);
            } else {
                failed++;
                console.log(`✗ Ошибка загрузки фото активности ${index + 1}: ${img.src}`);
            }
        });

        console.log(`Итог: ${loaded} загружено, ${failed} не загружено`);
    }, 2000);
}

// Запускаем проверку после рендеринга
setTimeout(checkPhotosLoaded, 3000);

/* =============================================
   INTERNATIONALIZATION (i18n) MODULE
   ============================================= */

const translations = {
    en: {
        // Login Page
        login: {
            title: 'Hoffenbach Analytics',
            subtitle: 'Amazon Sales Dashboard',
            username: 'Username',
            password: 'Password',
            remember: 'Remember me',
            submit: 'Sign In',
            footer: 'Secure analytics platform for Amazon sellers',
            error: {
                invalid: 'Invalid username or password',
                empty: 'Please fill in all fields'
            }
        },

        // Navigation
        nav: {
            dashboard: 'Dashboard',
            sales: 'Sales',
            products: 'Products',
            analytics: 'Analytics',
            orders: 'Orders',
            automation: 'Automation',
            settings: 'Settings'
        },

        // User
        user: {
            role: 'Administrator'
        },

        // Dashboard
        dashboard: {
            title: 'Dashboard',
            subtitle: 'Welcome back! Here\'s your sales overview.'
        },

        // KPI Cards
        kpi: {
            revenue: 'Total Revenue',
            orders: 'Total Orders',
            units: 'Units Sold',
            avgOrder: 'Avg Order Value'
        },

        // Charts
        charts: {
            salesTrend: 'Sales Trend',
            byCountry: 'Sales by Country',
            topProducts: 'Top Products',
            hourlyOrders: 'Orders by Hour'
        },

        // Tables
        tables: {
            recentOrders: 'Recent Orders',
            viewAll: 'View All',
            orderId: 'Order ID',
            product: 'Product',
            country: 'Country',
            date: 'Date',
            amount: 'Amount',
            status: 'Status'
        },

        // Status
        status: {
            shipped: 'Shipped',
            pending: 'Pending',
            cancelled: 'Cancelled'
        },

        // Countries
        countries: {
            DE: 'Germany',
            GB: 'United Kingdom',
            FR: 'France',
            IT: 'Italy',
            ES: 'Spain',
            NL: 'Netherlands',
            PL: 'Poland',
            SE: 'Sweden',
            BE: 'Belgium',
            IE: 'Ireland',
            TR: 'Turkey',
            AE: 'UAE',
            SA: 'Saudi Arabia'
        },

        // Common
        common: {
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            search: 'Search...',
            noData: 'No data available'
        }
    },

    ru: {
        // Страница входа
        login: {
            title: 'Hoffenbach Аналитика',
            subtitle: 'Панель продаж Amazon',
            username: 'Имя пользователя',
            password: 'Пароль',
            remember: 'Запомнить меня',
            submit: 'Войти',
            footer: 'Защищенная платформа аналитики для продавцов Amazon',
            error: {
                invalid: 'Неверное имя пользователя или пароль',
                empty: 'Пожалуйста, заполните все поля'
            }
        },

        // Навигация
        nav: {
            dashboard: 'Панель',
            sales: 'Продажи',
            products: 'Товары',
            analytics: 'Аналитика',
            orders: 'Заказы',
            automation: 'Автоматизация',
            settings: 'Настройки'
        },

        // Пользователь
        user: {
            role: 'Администратор'
        },

        // Панель управления
        dashboard: {
            title: 'Панель управления',
            subtitle: 'С возвращением! Вот обзор ваших продаж.'
        },

        // KPI карточки
        kpi: {
            revenue: 'Общая выручка',
            orders: 'Всего заказов',
            units: 'Продано единиц',
            avgOrder: 'Средний чек'
        },

        // Графики
        charts: {
            salesTrend: 'Динамика продаж',
            byCountry: 'Продажи по странам',
            topProducts: 'Топ товаров',
            hourlyOrders: 'Заказы по часам'
        },

        // Таблицы
        tables: {
            recentOrders: 'Последние заказы',
            viewAll: 'Показать все',
            orderId: 'ID заказа',
            product: 'Товар',
            country: 'Страна',
            date: 'Дата',
            amount: 'Сумма',
            status: 'Статус'
        },

        // Статус
        status: {
            shipped: 'Отправлен',
            pending: 'В обработке',
            cancelled: 'Отменен'
        },

        // Страны
        countries: {
            DE: 'Германия',
            GB: 'Великобритания',
            FR: 'Франция',
            IT: 'Италия',
            ES: 'Испания',
            NL: 'Нидерланды',
            PL: 'Польша',
            SE: 'Швеция',
            BE: 'Бельгия',
            IE: 'Ирландия',
            TR: 'Турция',
            AE: 'ОАЭ',
            SA: 'Саудовская Аравия'
        },

        // Общее
        common: {
            loading: 'Загрузка...',
            error: 'Ошибка',
            success: 'Успешно',
            save: 'Сохранить',
            cancel: 'Отмена',
            delete: 'Удалить',
            edit: 'Редактировать',
            search: 'Поиск...',
            noData: 'Нет данных'
        }
    },

    ua: {
        // Сторінка входу
        login: {
            title: 'Hoffenbach Аналітика',
            subtitle: 'Панель продажів Amazon',
            username: "Ім'я користувача",
            password: 'Пароль',
            remember: "Запам'ятати мене",
            submit: 'Увійти',
            footer: 'Захищена платформа аналітики для продавців Amazon',
            error: {
                invalid: "Невірне ім'я користувача або пароль",
                empty: "Будь ласка, заповніть усі поля"
            }
        },

        // Навігація
        nav: {
            dashboard: 'Панель',
            sales: 'Продажі',
            products: 'Товари',
            analytics: 'Аналітика',
            orders: 'Замовлення',
            automation: 'Автоматизація',
            settings: 'Налаштування'
        },

        // Користувач
        user: {
            role: 'Адміністратор'
        },

        // Панель керування
        dashboard: {
            title: 'Панель керування',
            subtitle: 'З поверненням! Ось огляд ваших продажів.'
        },

        // KPI картки
        kpi: {
            revenue: 'Загальний дохід',
            orders: 'Всього замовлень',
            units: 'Продано одиниць',
            avgOrder: 'Середній чек'
        },

        // Графіки
        charts: {
            salesTrend: 'Динаміка продажів',
            byCountry: 'Продажі по країнах',
            topProducts: 'Топ товарів',
            hourlyOrders: 'Замовлення по годинах'
        },

        // Таблиці
        tables: {
            recentOrders: 'Останні замовлення',
            viewAll: 'Показати всі',
            orderId: 'ID замовлення',
            product: 'Товар',
            country: 'Країна',
            date: 'Дата',
            amount: 'Сума',
            status: 'Статус'
        },

        // Статус
        status: {
            shipped: 'Відправлено',
            pending: 'В обробці',
            cancelled: 'Скасовано'
        },

        // Країни
        countries: {
            DE: 'Німеччина',
            GB: 'Великобританія',
            FR: 'Франція',
            IT: 'Італія',
            ES: 'Іспанія',
            NL: 'Нідерланди',
            PL: 'Польща',
            SE: 'Швеція',
            BE: 'Бельгія',
            IE: 'Ірландія',
            TR: 'Туреччина',
            AE: 'ОАЕ',
            SA: 'Саудівська Аравія'
        },

        // Загальне
        common: {
            loading: 'Завантаження...',
            error: 'Помилка',
            success: 'Успішно',
            save: 'Зберегти',
            cancel: 'Скасувати',
            delete: 'Видалити',
            edit: 'Редагувати',
            search: 'Пошук...',
            noData: 'Немає даних'
        }
    }
};

// i18n Class
class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.init();
    }

    init() {
        this.updateLanguageButtons();
        this.translatePage();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.setLanguage(lang);
            });
        });
    }

    setLanguage(lang) {
        if (translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('language', lang);
            this.updateLanguageButtons();
            this.translatePage();
        }
    }

    updateLanguageButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
        });
    }

    translatePage() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;
    }

    getTranslation(key) {
        const keys = key.split('.');
        let value = translations[this.currentLang];

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                // Fallback to English
                value = translations['en'];
                for (const k2 of keys) {
                    if (value && value[k2]) {
                        value = value[k2];
                    } else {
                        return null;
                    }
                }
                return value;
            }
        }

        return value;
    }

    t(key) {
        return this.getTranslation(key) || key;
    }
}

// Initialize i18n
const i18n = new I18n();

// Export for use in other modules
window.i18n = i18n;

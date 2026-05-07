// translator.js
const T_URL = 'https://byyscovhwjmjbjooqolc.supabase.co';
const T_KEY = 'sb_publishable_5PFScQhSqxyMNKWUlMDdGw_34Mozf1j';
const t_sb = supabase.createClient(T_URL, T_KEY);

// Теперь по умолчанию 'rus'
let currentLang = localStorage.getItem('appLang') || 'rus';

window.translations = {};

// 🔥 ВЫНЕСЛИ ЛОГИКУ В ГЛОБАЛЬНУЮ ФУНКЦИЮ
window.translatePage = function() {
    if (!window.translations || Object.keys(window.translations).length === 0) return;

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        let text = window.translations[key];
        
        if (text) {
            // Если у элемента есть атрибут data-goal, заменяем {goal} на цифру
            if (el.hasAttribute('data-goal')) {
                text = text.replace('{goal}', el.getAttribute('data-goal'));
            }
            // Используем innerHTML для тегов вроде <span> и <br>
            el.innerHTML = text; 
        }
    });
};

async function initTranslations() {
    try {
        const { data, error } = await t_sb
            .from('interface_text')
            .select(`key, ${currentLang}`);

        if (error) throw error;

        data.forEach(item => {
            // Фолбэк: если вдруг на укр пусто, подставит русское, чтобы не было 'undefined'
            window.translations[item.key] = item[currentLang] || item.rus || item.key;
        });

        // Запускаем первый проход перевода для статических элементов страницы
        window.translatePage();

        document.dispatchEvent(new Event('translationsReady'));
    } catch (err) {
        console.error('Ошибка переводчика:', err);
    }
}

function setLanguage(lang) {
    localStorage.setItem('appLang', lang);
    location.reload();
}

document.addEventListener('DOMContentLoaded', initTranslations);

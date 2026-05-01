// translator.js
const T_URL = 'https://byyscovhwjmjbjooqolc.supabase.co';
const T_KEY = 'sb_publishable_5PFScQhSqxyMNKWUlMDdGw_34Mozf1j';
const t_sb = supabase.createClient(T_URL, T_KEY);

// Теперь по умолчанию 'rus'
let currentLang = localStorage.getItem('appLang') || 'rus';

window.translations = {};

async function initTranslations() {
    try {
        const { data, error } = await t_sb
            .from('interface_text')
            .select(`key, ${currentLang}`);

        if (error) throw error;

        data.forEach(item => {
            window.translations[item.key] = item[currentLang];
        });

        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            // ИСПРАВЛЕНИЕ: innerText заменено на innerHTML
            if (window.translations[key]) el.innerHTML = window.translations[key];
        });

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
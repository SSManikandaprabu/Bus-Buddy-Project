// --- Core Data: Translations Object (excerpt) ---
const translations = {
    en: {
        nav_bus_tickets: "Bus Tickets",
        nav_helpline: "24/7 Helpline",
        hero_title: "Your Journey, Our Priority.",
        form_from: "From",
        // ... more translations ...
    },
    hi: {
        nav_bus_tickets: "बस टिकट",
        nav_helpline: "24/7 हेल्पलाइन",
        hero_title: "आपकी यात्रा, हमारी प्राथमिकता।",
        form_from: "से",
        // ... more translations ...
    },
    ta: {
        nav_bus_tickets: "பேருந்து டிக்கெட்டுகள்",
        nav_helpline: "24/7 ஹெல்ப்லைன்",
        hero_title: "உங்கள் பயணம், எங்கள் முன்னுரிமை.",
        form_from: "இருந்து",
        // ... more translations ...
    }
};

// --- Core Functions and Event Listeners ---

function translatePage(lang) {
    // 1. Update text content for elements with data-i18n-key
    document.querySelectorAll('[data-i18n-key]').forEach(el => {
        const key = el.getAttribute('data-i18n-key');
        if(translations[lang] && translations[lang][key]) {
           el.innerText = translations[lang][key];
        }
    });
    // 2. Update placeholder text for inputs with data-i18n-placeholder-key
    document.querySelectorAll('[data-i18n-placeholder-key]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder-key');
         if(translations[lang] && translations[lang][key]) {
           el.placeholder = translations[lang][key];
        }
    });
}

function setLanguage(lang) {
    // 3. Persistence: Store selected language in localStorage
    localStorage.setItem('language', lang);
    document.getElementById('current-lang').textContent = lang.toUpperCase();
    // 4. Update the entire page
    translatePage(lang);
}

// Event listener for the language menu (on DOMContentLoaded)
document.getElementById('language-menu').addEventListener('click', e => {
    if (e.target.classList.contains('lang-option')) {
        e.preventDefault();
        setLanguage(e.target.dataset.lang);
    }
});

// Initial Load (on DOMContentLoaded)
const savedLang = localStorage.getItem('language') || 'en';
setLanguage(savedLang);
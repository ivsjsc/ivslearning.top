document.addEventListener('DOMContentLoaded', () => {
    const languageToggle = document.getElementById('language-toggle');
    const langText = languageToggle.querySelector('.lang-text');
    const langIcon = languageToggle.querySelector('.fi');

    const elementsToTranslate = document.querySelectorAll('[data-en]');

    const updateContent = (language) => {
        elementsToTranslate.forEach(el => {
            const originalText = el.dataset.vi || el.innerHTML;
            if (!el.dataset.vi) {
                el.dataset.vi = originalText;
            }

            if (language === 'en') {
                el.innerHTML = el.dataset.en;
            } else {
                el.innerHTML = el.dataset.vi;
            }
        });

        if (language === 'en') {
            langText.textContent = 'ENG';
            langIcon.classList.remove('fi-vn');
            langIcon.classList.add('fi-gb');
            document.documentElement.lang = 'en';
        } else {
            langText.textContent = 'VIE';
            langIcon.classList.remove('fi-gb');
            langIcon.classList.add('fi-vn');
            document.documentElement.lang = 'vi';
        }
    };

    languageToggle.addEventListener('click', () => {
        const currentLang = localStorage.getItem('language') || 'vi';
        const newLang = currentLang === 'vi' ? 'en' : 'vi';
        localStorage.setItem('language', newLang);
        updateContent(newLang);
    });

    // Set initial language
    const savedLang = localStorage.getItem('language') || 'vi';
    updateContent(savedLang);
});

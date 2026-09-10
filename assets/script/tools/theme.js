(function () {

    const STORAGE_KEY = 'together-theme';
    const root        = document.documentElement;

    function resolveTheme(theme) {
        if (theme === 'light' || theme === 'clair' || theme === '1') return 'light';
        if (theme === 'dark'  || theme === 'sombre'|| theme === '2') return 'dark';

        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(themeValue) {
        const activeTheme = resolveTheme(themeValue);
        root.setAttribute('data-theme', activeTheme);

        const icon = document.getElementById('theme-icon');
        if (icon) {
            icon.className = activeTheme === 'light' ? 'ti ti-sun' : 'ti ti-moon';
        }
    }

    window.setTogetherTheme = function(themeValue, saveToStorage = true) {
        if (saveToStorage) {
            localStorage.setItem(STORAGE_KEY, themeValue);
        }
        applyTheme(themeValue);
    };

    function toggleTheme() {
        const current = root.getAttribute('data-theme') ?? 'dark';
        const next    = current === 'dark' ? 'light' : 'dark';
        window.setTogetherTheme(next, true);
    }

    const savedTheme = localStorage.getItem(STORAGE_KEY);
    applyTheme(savedTheme || 'system');

    document.addEventListener('DOMContentLoaded', function () {
        const btn = document.getElementById('theme-btn');
        if (btn) {
            btn.addEventListener('click', toggleTheme);
        }

        fetch('../api/loaders/loadPreferences.php')
            .then(res => res.ok ? res.json() : null)
            .then(res => {
                if (res && res.success && res.data && res.data.theme) {
                    if (!localStorage.getItem(STORAGE_KEY)) {
                        applyTheme(res.data.theme);
                    }
                }
            })
            .catch(err => console.error('Erreur chargement préférences thème :', err));

        window.matchMedia('(prefers-color-scheme: light)')
            .addEventListener('change', function () {
                const currentSaved = localStorage.getItem(STORAGE_KEY);
                if (!currentSaved || currentSaved === 'system' || currentSaved === '3') {
                    applyTheme('system');
                }
            });
    });

})();
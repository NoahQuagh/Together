function bindPreferenceAcnt(initialValues){
    const form = document.getElementById('form-appearance');
    if (!form) return;

    const btnSave = form.querySelector('.profile-btn-save');
    const slider = form.querySelector('.slider');
    const hiddenAlert = form.querySelector('.tk-alert');

    function checkChanges() {
        const currentTheme = form.querySelector('input[name="theme"]:checked')?.value ?? '';
        const currentAccent = form.querySelector('input[name="accent_color"]:checked')?.value ?? '';
        const currentAlert = hiddenAlert.value === '1';

        const hasChanged = (currentTheme !== initialValues.theme) ||
            (currentAccent !== initialValues.accent_color) ||
            (currentAlert !== initialValues.tasks_alert);

        btnSave.disabled = !hasChanged;
    }

    slider.addEventListener('click', function () {
        const isNowActive = slider.classList.toggle('active');
        hiddenAlert.value = isNowActive ? '1' : '0';
        checkChanges();
    });

    form.addEventListener('change', checkChanges);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const themeValue = form.querySelector('input[name="theme"]:checked')?.value;
        const accentValue = form.querySelector('input[name="accent_color"]:checked')?.value;
        const tasksAlertValue = Number(hiddenAlert.value);

        if (window.setTogetherTheme && themeValue) {
            window.setTogetherTheme(themeValue, true);
        }

        try {
            const response = await fetch('../api/updater/updatePreferences.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    theme: themeValue,
                    accent_color: accentValue,
                    tasks_alert: tasksAlertValue
                })
            });

            const json = await response.json();
            if (json.success) {
                initialValues.theme = themeValue;
                initialValues.accent_color = accentValue;
                initialValues.tasks_alert = tasksAlertValue === 1;
                checkChanges();
                showToast("Modification réussie", "success", json.message);
            } else {
                showToast("Modification impossible", "warning", json.message);
            }
        } catch (err) {
            showToast("Erreur réseau lors de la sauvegarde", "error", err.message || "Impossible de contacter le serveur");
        }
    });
}
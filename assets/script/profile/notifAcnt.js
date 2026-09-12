function bindNotificationForm() {
    const form = document.getElementById('form-notifications');
    if (!form) return;

    const saveBtn = form.querySelector('.profile-btn-save');
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');

    const originalState = {};
    checkboxes.forEach(cb => {
        originalState[cb.name] = cb.checked;
    });

    if (saveBtn) saveBtn.disabled = true;

    function checkChanges() {
        let hasChanged = false;
        checkboxes.forEach(cb => {
            if (cb.checked !== originalState[cb.name]) {
                hasChanged = true;
            }
        });

        if (saveBtn) {
            saveBtn.disabled = !hasChanged;
        }
    }

    checkboxes.forEach(cb => {
        cb.addEventListener('change', checkChanges);
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const payload = {};
        checkboxes.forEach(cb => {
            payload[cb.name] = cb.checked ? 1 : 0;
        });

        fetch('../api/updater/updateNotif.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(res => {
                if (!res.success) {
                    showToast(__t('modification not possible'), 'error',res.message);
                    return;
                }

                showToast(__t('preferences updated successfully'), 'success',res.message);

                checkboxes.forEach(cb => {
                    originalState[cb.name] = cb.checked;
                });
                if (saveBtn) saveBtn.disabled = true;
            })
            .catch(err => {
                showToast(__t('unable to update preferences'), 'error');
            });
    });
}
function bindProfileForm() {
    const form = document.getElementById('profileForm');
    if (!form) return;

    const saveBtn = form.querySelector('.profile-btn-save');
    const inputs = form.querySelectorAll('input');

    const originalValues = {};
    inputs.forEach(input => {
        originalValues[input.id] = input.value.trim();
    });

    if (saveBtn) saveBtn.disabled = true;

    function checkChanges() {
        let hasChanged = false;

        inputs.forEach(input => {
            if (input.value.trim() !== originalValues[input.id]) {
                hasChanged = true;
            }
        });

        if (saveBtn) {
            saveBtn.disabled = !hasChanged;
        }
    }

    inputs.forEach(input => {
        input.addEventListener('input', checkChanges);
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const prenomVal = document.getElementById('prenom').value.trim();
        const nomVal    = document.getElementById('nom').value.trim();
        const emailVal  = document.getElementById('email').value.trim();

        fetch('../api/updater/updateProfile.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prenom: prenomVal,
                nom: nomVal,
                email: emailVal
            })
        })
            .then(res => res.json())
            .then(res => {

                if (!res.success) {
                    showToast('Modification impossible', 'error',res.message);
                    return;
                }


                showToast('Modification réussie', 'success',res.message);

                originalValues['prenom'] = prenomVal;
                originalValues['nom'] = nomVal;
                originalValues['email'] = emailVal;

                if (saveBtn) saveBtn.disabled = true;

                const nameElem = document.getElementById('profileDisplayName');
                if (nameElem) {
                    nameElem.textContent = `${prenomVal} ${nomVal}`;
                }

            })
            .catch(err => {
                console.log(err)
                showToast(__t('unable to update profile'), 'error');
            });
    });
}
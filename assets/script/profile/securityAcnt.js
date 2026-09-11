function supCompte(){
    fetch('../api/deleter/deleteAccount.php', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(r => r.json())
        .then(data => {
            if (!data.success) {
                showToast(__t('impossible action'), 'error');
                return;
            }else{
                window.location.href='../../../auth/login.php';
            }
        }).catch(() => showToast(__t('impossible action'), 'error'));
}

function modifyPW(){
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

        const currentPassWVal = document.getElementById('mdp-actuel').value.trim();
        const newPassWVal    = document.getElementById('mdp-nouveau').value.trim();
        const confirmPassWVal  = document.getElementById('mdp-confirm').value.trim();

        fetch('../api/updater/updatePassWordProfile.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                passW: currentPassWVal,
                newPassW: newPassWVal,
                confirmPassW: confirmPassWVal
            })
        })
            .then(res => res.json())
            .then(res => {

                if (!res.success) {
                    console.log(res.message);
                    showToast('Modification impossible', 'error',res.message);
                    return;
                }


                showToast('Modification réussie', 'success', res.message);

                document.getElementById('mdp-actuel').value = '';
                document.getElementById('mdp-nouveau').value = '';
                document.getElementById('mdp-confirm').value = '';

                inputs.forEach(input => originalValues[input.id] = '');
                if (saveBtn) saveBtn.disabled = true;

            })
            .catch(err => {
                console.log(err)
                showToast(__t('unable to update password'), 'error');
            });
    });
}

document.addEventListener('DOMContentLoaded', modifyPW);
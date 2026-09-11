let elementAAfficherAnimationD = null;

function saveBtnD(bouton) {
    elementAAfficherAnimationD = bouton.closest('.proj-item');
}

function quitterProjet(proUuid) {
    closeModal('quitProject_'+proUuid)
    fetch('../api/deleter/quitProject.php', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ pro_uuid: proUuid })
    })
        .then(r => r.json())
        .then(data => {
            if (!data.success) {
                showToast(__t('unable to leave the project'), 'error');
                return;
            }

            elementAAfficherAnimation.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            elementAAfficherAnimation.style.opacity    = '0';
            elementAAfficherAnimation.style.transform  = 'translateX(-12px)';
            setTimeout(() => {
                elementAAfficherAnimation.remove();

                const remaining = document.querySelectorAll('#projectList .proj-item');
                if (remaining.length === 0) {
                    document.getElementById('projectList').remove();
                    const page = document.querySelector('.proj-page');
                    if (page) {
                        page.insertAdjacentHTML('beforeend', `
                        <div class="dash-empty proj-empty-global">
                            <i class="ti ti-folder-off"></i>
                            <p>${__t("you are not part of any project")}.</p>
                        </div>
                    `);
                    }
                }
            }, 280);
            showToast(__t('delete project'), 'success')
        })
        .catch(() => showToast(__t('unable to leave the project'), 'error'));
}
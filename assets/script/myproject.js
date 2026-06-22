let idProjetASupprimer = null;
let elementAAfficherAnimation = null;

function preparerSuppression(id, bouton) {
    idProjetASupprimer = id;

    elementAAfficherAnimation = bouton.closest('.proj-item');

    openModal('supProjet');
}

function supprimerProjetconfirmer() {
    if (idProjetASupprimer === null || elementAAfficherAnimation === null) return;

    try{
        supprimerProjet(idProjetASupprimer, elementAAfficherAnimation);
        closeModal('supProjet');
        showToast('Projet supprimer avec succès !', 'success');
    }catch{
        showToast('Impossible de supprimer le projet', 'success');
    }
}

function projet() {

    const filterBtns = document.querySelectorAll('.proj-filter-btn');
    const items       = document.querySelectorAll('#projectList .proj-item');
    const emptyMsg    = document.getElementById('emptyFiltered');
    const list        = document.getElementById('projectList');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            let visible  = 0;

            items.forEach(item => {
                const match = filter === 'tout' || item.dataset.statut === filter;
                item.style.display = match ? '' : 'none';
                if (match) visible++;
            });

            if (emptyMsg) emptyMsg.style.display = visible === 0 ? 'flex' : 'none';
            if (list)     list.style.display     = visible === 0 ? 'none' : 'flex';
        });
    });

    let openDropdown = null;

    document.querySelectorAll('.more-wrapper').forEach(wrapper => {
        const trigger  = wrapper.querySelector('.btn-more');
        const dropdown = wrapper.querySelector('.more-dropdown');
        const proId    = trigger.dataset.id;
        let closeTimer = null;

        trigger.addEventListener('click', e => {
            e.stopPropagation();

            if (openDropdown && openDropdown !== dropdown) {
                openDropdown.classList.remove('active');
            }

            dropdown.classList.toggle('active');
            openDropdown = dropdown.classList.contains('active') ? dropdown : null;
        });

        dropdown.addEventListener('click', e => e.stopPropagation());

        wrapper.addEventListener('mouseleave', () => {
            closeTimer = setTimeout(() => dropdown.classList.remove('active'), 200);
        });
        wrapper.addEventListener('mouseenter', () => clearTimeout(closeTimer));

        dropdown.querySelectorAll('.more-dropdown-item').forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
                const newStatut = item.dataset.statut;
                dropdown.classList.remove('active');
                openDropdown = null;
                changerStatut(proId, newStatut, wrapper.closest('.proj-item'));
            });
        });
    });

    document.addEventListener('click', () => {
        if (openDropdown) {
            openDropdown.classList.remove('active');
            openDropdown = null;
        }
    });

    /* ── Bouton Éditer ────────────────────────────── */
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const proId = btn.dataset.id;
            // TODO : ouvrir la modale d'édition avec proId
            console.log('Éditer projet', proId);
        });
    });
}

function changerStatut(proId, newStatut, liElement) {
    fetch('../api/updateProjectStatut.php', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ pro_id: proId, statut: newStatut })
    })
        .then(r => r.json())
        .then(data => {
            if (!data.success) {
                alert('Erreur : ' + (data.message || 'Impossible de changer le statut.'));
                return;
            }

            /* Mise à jour du data-statut sur le <li> */
            liElement.dataset.statut = newStatut;

            /* Mise à jour du badge visible */
            const badge = liElement.querySelector('.proj-statut-badge');
            if (badge) {
                badge.textContent = newStatut;
                badge.className   = 'badge ' + statutBadgeJS(newStatut) + ' proj-statut-badge';
            }

            /* Re-appliquer le filtre actif sans recharger */
            const activeFilter = document.querySelector('.proj-filter-btn.active');
            if (activeFilter && activeFilter.dataset.filter !== 'tout') {
                activeFilter.click();
            }
        })
        .catch(() => alert('Erreur réseau. Réessayez.'));
}

function supprimerProjet(proId, liElement) {
    fetch('../api/deleteProject.php', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ pro_id: proId })
    })
        .then(r => r.json())
        .then(data => {
            if (!data.success) {
                alert('Erreur : ' + (data.message || 'Impossible de supprimer.'));
                return;
            }

            liElement.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            liElement.style.opacity    = '0';
            liElement.style.transform  = 'translateX(-12px)';
            setTimeout(() => {
                liElement.remove();

                const remaining = document.querySelectorAll('#projectList .proj-item');
                if (remaining.length === 0) {
                    /* Plus aucun projet du tout */
                    document.getElementById('projectList').remove();
                    const page = document.querySelector('.proj-page');
                    if (page) {
                        page.insertAdjacentHTML('beforeend', `
                        <div class="dash-empty proj-empty-global">
                            <i class="ti ti-folder-off"></i>
                            <p>Vous n'avez encore créé aucun projet.</p>
                            <div>
                                <button class="proj-create-btn" onclick="window.location.href='home.php?tab=mesProjets&action=creer'">
                                    <i class="ti ti-plus"></i>
                                    Créer mon premier projet
                                </button>
                            </div>
                        </div>
                    `);
                    }
                }
            }, 280);
        })
        .catch(() => alert('Erreur réseau. Réessayez.'));
}

function statutBadgeJS(statut) {
    const map = {
        actif   : 'badge-green',
        pause   : 'badge-yellow',
        termine : 'badge-blue',
    };
    return map[statut] || 'badge-blue';
}

document.addEventListener('DOMContentLoaded', projet);
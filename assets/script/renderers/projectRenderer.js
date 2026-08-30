function statutBadge(statut) {
    const map = { 'a_faire': 'badge-blue', 'en_cours': 'badge-yellow', 'review': 'badge-gray', 'termine': 'badge-green' };
    return map[statut] ?? 'badge-gray';
}

function prioriteClass(priorite) {
    const map = { 'critique': 'tk-card--critique', 'haute': 'tk-card--haute', 'normale': 'tk-card--normale', 'basse': 'tk-card--basse' };
    return map[priorite] ?? '';
}

function prioriteBadge(priorite) {
    const map = { 'critique': 'badge-red', 'haute': 'badge-yellow', 'normale': 'badge-blue', 'basse': 'badge-green' };
    return map[priorite] ?? 'badge-gray';
}

function prioriteIcon(priorite) {
    const map = { 'critique': '<i class="ti ti-alert-triangle"></i>', 'haute': '<i class="ti ti-triangle"></i>', 'normale': '<i class="ti ti-circle"></i>', 'basse': '<i class="ti ti-triangle-inverted"></i>' };
    return map[priorite] ?? '';
}

function statutIcon(priorite) {
    const map = { 'à_faire': '<i class="ti ti-loader"></i>', 'en_cours': '<i class="ti ti-circle-dashed"></i>', 'review': '<i class="ti ti-telescope"></i>', 'termine': '<i class="ti ti-circle-check"></i>' };
    return map[priorite] ?? '';
}

function formatDate(dateInput) {
    if (!dateInput) return '';

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return ''; // Sécurité si la date est invalide

    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function prioriteColor(priorite) {
    const map = { 'critique': '#e04030', 'haute': '#d4901a', 'normale': '#5c90e8', 'basse': '#28b870' };
    return map[priorite] ?? '#7a7168';
}

function initiales(nom) {
    return nom.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

function renderProjectTasks(data) {

    const cartes = data.tasks.map(t => `
        <div class="tk-header tk-prio-${t.priorite} ${t.statut}">
            <h3>${t.priorite}</h3>
            <div class="tk-card">
                <div class="tk-top">
                    <div class="tk-badges">
                        <span class="tk-titre">${t.titre}</span>
                        <div class="zone-more"><i class="ti ti-dots-vertical"></i></div>
                    </div>
                    <div class="tk-info">
                        <h4>${statutIcon(t.statut)} ${t.statut ? (t.statut.charAt(0).toUpperCase() + t.statut.slice(1)).replaceAll('_', ' ') : ''}</h4>
                    </div>
                    <div class="tk-etiquettes">
                            ${(t.etiquettes ?? []).map(e =>
        `<span class="tk-info-badge" style="background:${e.couleur};color:white;">${e.label}</span>`
    ).join('')}
                        </div>
                </div>

                <div class="tk-bottom">
                    <div class="tk-line">
                        <div class="tk-people">
                            ${(t.assignes ?? []).length > 0
        ? t.assignes.map(a =>
            `<div class="tk-person">
                                        <div class="tk-avatar">${initiales(a.nom)}</div>
                                        <span class="tk-person-label">${a.nom}</span>
                                    </div>`).join('')
        : `<span class="tk-unassigned"><i class="ti ti-user-off"></i> Non assigné</span>`
    }
                        </div>
                        <div class="tk-meta">
                            <span class="tk-meta-item">
                                <div>
                                    <i class="ti ti-calendar" aria-hidden="true"></i>
                                    <span class="tk-date">${t.date_fin ? formatDate(t.date_debut.split(' ')[0]) : 'Non indiqué'}</span>
                                </div>
                                <div>
                                    <i class="ti ti-clock" aria-hidden="true"></i>
                                    <span class="tk-time">${t.date_fin && t.date_fin.split(' ')[1] ? t.date_fin.split(' ')[1].slice(0, 5) : ''}</span>
                                </div>
                            </span>
                        </div>
                    </div>

                    <div class="btn-option-tas">
                        <button class="tk-btn-wh" onclick="openModal('modal-task-${t.id}')">
                            <i class="ti ti-info-circle" aria-hidden="true"></i>Voir Détails
                        </button>
                        <button class="tk-btn-ink">
                            ${getActionLabel(t.statut)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    const modals = data.tasks.map(t => {
        const col = prioriteColor(t.priorite);
        return `
        <div id="modal-task-${t.id}" class="modal-overlay" style="display:none;" onclick="closeModalOverlay(event,'modal-task-${t.id}')">
            <div class="modal-box tk-modal-${t.priorite}">

                <div class="modal-header">
                    <div class="modal-header-meta">
                        <span class="modal-statut">${statutIcon(t.statut)} ${t.statut ? t.statut.replaceAll('_', ' ') : ''}</span>
                    </div>
                    <button class="modal-close-btn" onclick="closeModal('modal-task-${t.id}')">
                        <i class="ti ti-x"></i>
                    </button>
                </div>

                <h2 class="modal-titre">${t.titre}</h2>

                <div class="modal-body">

                    <p class="modal-desc">${t.desc ?? '<em>Aucune description.</em>'}</p>

                    <div class="modal-section">
                        <span class="modal-section-label"><i class="ti ti-users"></i> Assignés</span>
                        <div class="tk-people">
                            ${(t.assignes ?? []).length > 0
            ? t.assignes.map(a =>
                `<div class="tk-person">
                                        <div class="tk-avatar">${initiales(a.nom)}</div>
                                        <span class="tk-person-label" style="color:var(--wh)">${a.nom}</span>
                                    </div>`).join('')
            : `<span class="tk-unassigned unassigned-ink"><i class="ti ti-user-off"></i> Non assigné</span>`
        }
                        </div>
                    </div>

                    <div class="modal-section">
                        <span class="modal-section-label"><i class="ti ti-tag"></i> Étiquettes</span>
                        <div class="tk-etiquettes">
                            ${(t.etiquettes ?? []).length > 0
            ? t.etiquettes.map(e =>
                `<span class="tk-info-badge" style="background:${e.couleur};color:white;">${e.label}</span>`
            ).join('')
            : `<span class="modal-empty">Aucune étiquette</span>`
        }
                        </div>
                    </div>

                    <div class="modal-section modal-dates">
                        <div class="modal-date-item">
                            <span class="modal-section-label"><i class="ti ti-calendar-event"></i> Début</span>
                            <span class="tk-date-modal">${t.date_debut ? formatDate(t.date_debut.split(' ')[0]) : 'Non indiqué'} à ${t.date_debut && t.date_debut.split(' ')[1] ? t.date_debut.split(' ')[1].slice(0, 5) : ''}</span>
                        </div>
                        <div class="modal-date-item">
                            <span class="modal-section-label"><i class="ti ti-calendar-due"></i> Fin</span>
                            <span class="tk-date-modal">${t.date_fin ? formatDate(t.date_debut.split(' ')[0]) : 'Non indiqué'} à ${t.date_fin && t.date_fin.split(' ')[1] ? t.date_fin.split(' ')[1].slice(0, 5) : ''}</span>
                        </div>
                        <div class="modal-date-item">
                            <span class="modal-section-label"><i class="ti ti-user-check"></i> Reporter</span>
                            <span>${t.reporter ?? '—'}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer"></div>
            </div>
        </div>`;
    }).join('');

    document.getElementById('tasks-zone').innerHTML = `<div class="tk-grid">${cartes}</div>${modals}`;
}


function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => m.classList.add('modal--open'));
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove('modal--open');
    m.addEventListener('transitionend', () => {
        m.style.display = 'none';
        document.body.style.overflow = '';
    }, { once: true });
}

function closeModalOverlay(event, id) {
    if (event.target === event.currentTarget) closeModal(id);
}

document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal-overlay.modal--open').forEach(m => closeModal(m.id));
});

function renderProjectOverview(data)  { document.getElementById('main-zone').innerHTML = `overview`; }
function renderProjectKanban(data)    { document.getElementById('main-zone').innerHTML = `kanban`; }
function renderProjectCalendar(data)  { document.getElementById('main-zone').innerHTML = `calendar`; }
function renderProjectSprints(data)   { document.getElementById('main-zone').innerHTML = `sprints`; }
function renderProjectMembers(data)   { document.getElementById('main-zone').innerHTML = `members`; }
function renderProjectInsights(data)  { document.getElementById('main-zone').innerHTML = `insights`; }

function getActionLabel(statut) {
    switch (statut) {
        case 'à_faire':  return '<i class="ti ti-player-play" aria-hidden="true"></i>Commencer';
        case 'en_cours': return '<i class="ti ti-pencil-check" aria-hidden="true"></i>Valider';
        case 'review':   return '<i class="ti ti-circle-check" aria-hidden="true"></i>Terminer';
        default:         return '<i class="ti ti-arrow-back-up" aria-hidden="true"></i>Annuler';
    }
}


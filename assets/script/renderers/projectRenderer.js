
const travaux = `<div class="wip-block block-trav">
    <div class="wip-icon-wrap">
        <i class="ti ti-crane" aria-hidden="true"></i>
        <span class="wip-badge">!</span>
    </div>
    <p class="wip-title">${__t('section under construction')}</p>
    <p class="wip-desc">${__t('this section is being developed and will be available soon')}</p>
    <div class="wip-dots">
        <div class="wip-dot"></div>
        <div class="wip-dot"></div>
        <div class="wip-dot"></div>
    </div>
</div>`;

/*fonction conver*/
function prioriteIcon(priorite) {
    const map = { 'critique': '<i class="ti ti-alert-triangle"></i>', 'haute': '<i class="ti ti-triangle"></i>', 'normale': '<i class="ti ti-circle"></i>', 'basse': '<i class="ti ti-triangle-inverted"></i>' };
    return map[priorite] ?? '';
}

function statutIcon(priorite) {
    const map = { 'en_attente': '<i class="ti ti-loader"></i>', 'en_cours': '<i class="ti ti-circle-dashed"></i>', 'en_review': '<i class="ti ti-telescope"></i>', 'termine': '<i class="ti ti-circle-check"></i>' };
    return map[priorite] ?? '';
}

function formatDate(dateInput) {
    if (!dateInput) return '';

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';


    return date.toLocaleDateString(__t('formatDate'), {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function formatForInput(dateStr) {
    if (!dateStr) return '';
    return dateStr.slice(0, 16).replace(' ', 'T');
}

function prioriteColor(priorite) {
    const map = { 'critique': '#e04030', 'haute': '#d4901a', 'normale': '#5c90e8', 'basse': '#28b870' };
    return map[priorite] ?? '#7a7168';
}


/*initiale si pas de pp*/
function initiales(nom) {
    return nom.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

/*modal*/
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


function getActionLabel(statut) {
    switch (statut) {
        case 'en_attente':  return '<i class=\"ti ti-player-play\" aria-hidden=\"true\"></i>'+__t("start");
        case 'en_cours': return '<i class=\"ti ti-pencil-check\" aria-hidden=\"true\"></i>'+__t("validate");
        case 'en_review':   return '<i class="ti ti-circle-check" aria-hidden="true"></i>'+__t("complete");
        default:         return '<i class="ti ti-arrow-back-up" aria-hidden="true"></i>'+__t("cancel");
    }
}

function closeModalOverlay(event, id) {
    if (event.target === event.currentTarget) closeModal(id);
}

document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal-overlay.modal--open').forEach(m => closeModal(m.id));
});

/*erreur de filtre*/
function renderNoTasksFound() {
    const container = document.getElementById('tasks-zone');
    if (!container) return;

    container.innerHTML = `
        <div class="empty-state">
            <i class="ti ti-filter-off" style="font-size: 2.5rem; color: var(--wh3, #888);"></i>
            <h3>${__t('no tasks match the selected filter')}.</h3>
            <p>${__t('try modifying or resetting your search criteria')}.</p>
        </div>
    `;
}

function renderFilterError() {
    const container = document.getElementById('tasks-zone');
    if (!container) return;

    container.innerHTML = `
        <div class="dash-error-msg error-state">
            <i class="ti ti-face-id-error"></i>
            <h3>${__t('filters unavailable')}</h3>
            <p>${__t('an error occurred while loading the tasks')}.</p>
        </div>
    `;
}

/*aucune tache*/
function noTasksExist(){
    const container = document.getElementById('tasks-zone');
    if (!container) return;

    container.innerHTML = `
        <div class="dash-empty proj-empty-global">
            <i class="ti ti-coffee" aria-hidden="true"></i>
            <h4>${__t("you haven't created any tasks yet")}.</h4>
        <div>
        <button class="proj-create-btn" onclick="">
          <i class="ti ti-plus"></i>
          ${__t('create my first task')}
        </button>
    `;
}



function toggleTaskMenu(event, taskId) {
    event.stopPropagation();
    const currentMenu = document.getElementById(`dropdown-task-${taskId}`);
    const isOpen = currentMenu.classList.contains('show');

    document.querySelectorAll('.tk-dropdown-menu.show').forEach(m => m.classList.remove('show'));

    if (!isOpen) {
        currentMenu.classList.add('show');
    }
}


document.addEventListener('click', () => {
    document.querySelectorAll('.tk-dropdown-menu.show').forEach(m => m.classList.remove('show'));
});

let currentTaskData = [];
let activeFilteredTasks = [];

let currentSearchQuery = '';

/*initialisation*/
function initProjectTasks(data) {
    currentTaskData = data.tasks || [];
    activeFilteredTasks = [...currentTaskData];
    renderProjectTasks({ tasks: currentTaskData });
}

/*filtre*/
function getFilteredTasksBySearch(tasksToFilter = activeFilteredTasks) {
    if (!currentSearchQuery.trim()) {
        return tasksToFilter;
    }

    const query = currentSearchQuery.toLowerCase().trim();

    return tasksToFilter.filter(task =>
        task.titre && task.titre.toLowerCase().includes(query)
    );
}
function resetFilters() {
    const sortTitle = document.getElementById('filter-sort-title');
    const statut    = document.getElementById('filter-statut');
    const priorite  = document.getElementById('filter-priorite');
    const assignee  = document.getElementById('filter-assignee');
    const dateStart = document.getElementById('filter-date-start');
    const dateEnd   = document.getElementById('filter-date-end');

    if (sortTitle) sortTitle.value = '';
    if (statut)    statut.value    = '';
    if (priorite)  priorite.value  = '';
    if (assignee)  assignee.value  = '';
    if (dateStart) dateStart.value = '';
    if (dateEnd)   dateEnd.value   = '';

    const countBadge = document.getElementById('filter-count');
    if (countBadge) {
        countBadge.textContent = '';
    }
}
function applyFilters() {
    const params = new URLSearchParams();

    const urlPageParams = new URLSearchParams(window.location.search);
    const projectKey = urlPageParams.get('key') || urlPageParams.get('project');

    if (projectKey) {
        params.append('project', projectKey);
    } else {
        return renderFilterError();
    }

    const sortTitle = document.getElementById('filter-sort-title')?.value;
    const statut    = document.getElementById('filter-statut')?.value;
    const priorite  = document.getElementById('filter-priorite')?.value;
    const assignee  = document.getElementById('filter-assignee')?.value;
    const dateStart = document.getElementById('filter-date-start')?.value;
    const dateEnd   = document.getElementById('filter-date-end')?.value;

    let activeCount = 0;

    if (sortTitle) {params.append('sort', sortTitle);activeCount++; }
    if (statut)    {params.append('statut', statut);activeCount++; }
    if (priorite)  {params.append('priorite', priorite);activeCount++; }
    if (assignee)  {params.append('assignee', assignee);activeCount++; }
    if (dateStart) {params.append('date_start', dateStart);activeCount++; }
    if (dateEnd)   {params.append('date_end', dateEnd);activeCount++; }

    const countBadge = document.getElementById('filter-count');
    if (countBadge) {
        countBadge.textContent = activeCount > 0 ? `(${activeCount})` : '';
    }

    fetch(`/api/loader/loadProjectFilter.php?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                throw new Error(data.message);
            }

            currentTaskData = data.tasks || [];
            activeFilteredTasks = [...currentTaskData];

            const finalTasks = getFilteredTasksBySearch(activeFilteredTasks);

            if (finalTasks.length === 0) {
                renderNoTasksFound();
            } else {
                renderProjectTasks({ tasks: finalTasks });
            }

            closeModal('modal-task-filter');
        })
        .catch(error => {
            renderFilterError();
            closeModal('modal-task-filter');
        });
}

/*recherche*/
function handleSearchInput(event) {
    currentSearchQuery = event.target.value;

    const finalTasks = getFilteredTasksBySearch(activeFilteredTasks);
    renderProjectTasks({ tasks: finalTasks });
}
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.nav-item input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
    }
});



/*renderer du projet*/
function renderProjectTasks(data) {

    const cartes = data.tasks.map(t => `
            <div class="tk-card ${t.statut}">
                <div class="tk-top">
                    <div class="tk-badges">
                        <span class="tk-titre">${t.titre}</span>
                        <div class="tk-dropdown" onmouseleave="this.querySelector('.tk-dropdown-menu')?.classList.remove('show')">
                            <button type="button" class="zone-more" onclick="toggleTaskMenu(event, '${t.id}')">
                                <i class="ti ti-dots-vertical"></i>
                            </button>
                            <div id="dropdown-task-${t.id}" class="tk-dropdown-menu">
                                <button type="button" onclick="openModal('modal-task-modify-${t.id}')">
                                    <i class="ti ti-pencil"></i> ${__t('edit')}
                                </button>
                                <button type="button" onclick="duplicateTask('${t.id}')">
                                    <i class="ti ti-copy"></i> ${__t('duplicate')}
                                </button>
                                <div class="dropdown-divider"></div>
                                <button type="button" class="danger" onclick="deleteTask('${t.id}')">
                                    <i class="ti ti-trash"></i> ${__t('delete')}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="tk-info tk-info-${t.statut}">
                        <h4>${statutIcon(t.statut)} ${__t(t.statut)}</h4>
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
        : `<span class="tk-unassigned"><i class="ti ti-user-off"></i>${__t('unassigned')}</span>`
    }
                        </div>
                        <div class="tk-meta">
                            <span class="tk-meta-item">
                                <div>
                                    <i class="ti ti-calendar" aria-hidden="true"></i>
                                    <span class="tk-date">${t.date_fin ? formatDate(t.date_debut.split(' ')[0]) : __t('not specified')}</span>
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
                            <i class="ti ti-info-circle" aria-hidden="true"></i>${__t('view details')}
                        </button>
                        <button class="tk-btn-ink">
                            ${getActionLabel(t.statut)}
                        </button>
                    </div>
                </div>
            </div>
    `).join('');

    const modals = data.tasks.map(t => {
        const col = prioriteColor(t.priorite);
        return `
        <div id="modal-task-${t.id}" class="modal-overlay" style="display:none;" onclick="closeModalOverlay(event,'modal-task-${t.id}')">
            <div class="modal-box">

                <div class="modal-header">
                    <div class="modal-header-meta">
                        <span class="modal-statut">${statutIcon(t.statut)} ${__t(t.statut)}</span>
                    </div>
                    <button class="modal-close-btn" onclick="closeModal('modal-task-${t.id}')">
                        <i class="ti ti-x"></i>
                    </button>
                </div>

                <h2 class="modal-titre">${t.titre}</h2>

                <div class="modal-body">

                    <p class="modal-desc">${t.desc ?? `<em>${__t("no description")}</em>`}</p>

                    <div class="modal-section">
                        <span class="modal-section-label"><i class="ti ti-users"></i>${__t('assigned')}</span>
                        <div class="tk-people">
                            ${(t.assignes ?? []).length > 0
            ? t.assignes.map(a =>
                `<div class="tk-person">
                                        <div class="tk-avatar">${initiales(a.nom)}</div>
                                        <span class="tk-person-label" style="color:var(--wh)">${a.nom}</span>
                                    </div>`).join('')
            : `<span class="tk-unassigned unassigned-ink"><i class="ti ti-user-off"></i>${__t('unassigned')}</span>`
        }
                        </div>
                    </div>

                    <div class="modal-section">
                        <span class="modal-section-label"><i class="ti ti-tag"></i>${__t('labels')}</span>
                        <div class="tk-etiquettes">
                            ${(t.etiquettes ?? []).length > 0
            ? t.etiquettes.map(e =>
                `<span class="tk-info-badge" style="background:${e.couleur};color:white;">${e.label}</span>`
            ).join('')
            : `<span class="modal-empty">${__t('no label')}</span>`
        }
                        </div>
                    </div>

                    <div class="modal-section modal-dates">
                        <div class="modal-date-item">
                            <span class="modal-section-label"><i class="ti ti-calendar-event"></i>${__t('beginning')}</span>
                            <span class="tk-date-modal">${t.date_debut ? formatDate(t.date_debut.split(' ')[0]) : __t("not specified")} ${__t('at')} ${t.date_debut && t.date_debut.split(' ')[1] ? t.date_debut.split(' ')[1].slice(0, 5) : ''}</span>
                        </div>
                        <div class="modal-date-item">
                            <span class="modal-section-label"><i class="ti ti-calendar-due"></i>${__t('end')}</span>
                            <span class="tk-date-modal">${t.date_fin ? formatDate(t.date_debut.split(' ')[0]) : __t("not specified")} ${__t('at')} ${t.date_fin && t.date_fin.split(' ')[1] ? t.date_fin.split(' ')[1].slice(0, 5) : ''}</span>
                        </div>
                        <div class="modal-date-item">
                            <span class="modal-section-label"><i class="ti ti-user-check"></i> ${__t("reporter")}</span>
                            <span>${t.reporter ?? '—'}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer"></div>
            </div>
        </div>`;
    }).join('');

    const modalsModify = data.tasks.map(t => {

        return `
    <div id="modal-task-modify-${t.id}" class="modal-overlay tk-modify" style="display:none;" onclick="closeModalOverlay(event,'modal-task-modify-${t.id}')">
        <div class="modal-box">
            
            <form onsubmit="event.preventDefault(); /*fonction sauvegarde */" class="tk-form-layout">
                
                <div class="modal-header">
                    <div class="modal-header-meta">
                        <h4>${__t('edit task')}</h4>
                    </div>
                    <button type="button" class="modal-close-btn" onclick="closeModal('modal-task-modify-${t.id}')">
                        <i class="ti ti-x"></i>
                    </button>
                </div>

                <div class="modal-body">
                    
                    <div class="modal-section modal-section-full">
                        <label class="modal-section-label" for="titre-${t.id}">${__t('task title')}</label>
                        <input type="text" id="titre-${t.id}" name="${__t('title')}" class="tk-input tk-input-titre" value="${t.titre}" required />
                    </div>

                    <div class="modal-section modal-section-full">
                        <label class="modal-section-label" for="desc-${t.id}">${__t('description')}</label>
                        <textarea id="desc-${t.id}" name="desc" class="tk-input tk-textarea" placeholder="${__t('add a description')}...">${t.desc ?? ''}</textarea>
                    </div>

                    <div class="modal-section">
                        <span class="modal-section-label"><i class="ti ti-users"></i>${__t('assigned')}</span>
                        <div class="tk-people">
                            ${(t.assignes ?? []).length > 0
            ? t.assignes.map(a =>
                `<div class="tk-person tk-editable-badge">
                                    <div class="tk-avatar">${initiales(a.nom)}</div>
                                    <span class="tk-person-label" style="color:var(--wh)">${a.nom}</span>
                                    <button type="button" class="tk-remove-btn" title="Retirer"><i class="ti ti-x"></i></button>
                                </div>`).join('')
            : `<span class="tk-unassigned unassigned-ink"><i class="ti ti-user-off"></i>${__t('unassigned')}</span>`
        }
                            <button type="button" class="tk-btn-add-badge"><i class="ti ti-plus"></i>${__t('add')}</button>
                        </div>
                    </div>

                    <div class="modal-section">
                        <span class="modal-section-label"><i class="ti ti-tag"></i>${__t('labels')}</span>
                        <div class="tk-etiquettes">
                            ${(t.etiquettes ?? []).length > 0
            ? t.etiquettes.map(e =>
                `<span class="tk-info-badge tk-editable-badge" style="background:${e.couleur};color:white;">
                                    ${e.label}
                                    <button type="button" class="tk-remove-btn" title="Retirer"><i class="ti ti-x"></i></button>
                                </span>`
            ).join('')
            : `<span class="modal-empty">${__t('no label')}</span>`
        }
                            <button type="button" class="tk-btn-add-badge"><i class="ti ti-plus"></i>${__t('add')}</button>
                        </div>
                    </div>

                    <div class="modal-section modal-dates">
                        <div class="modal-date-item">
                            <label class="modal-section-label" for="date_debut-${t.id}"><i class="ti ti-calendar-event"></i>${__t('beginning')}</label>
                            <input type="datetime-local" id="date_debut-${t.id}" name="date_debut" class="tk-input" value="${formatForInput(t.date_debut)}">
                        </div>
                        
                        
                        <div class="modal-date-item">
                            <label class="modal-section-label" for="priotity-${t.id}">${__t('priority')}</label>
                            <select id="priotity-${t.id}" name="priotity" class="tk-input tk-select">
                                <option value="basse" ${t.priorite === 'basse' ? 'selected' : ''}>${__t('low')}</option>
                                <option value="normale" ${t.priorite === 'normale' ? 'selected' : ''}>${__t('normal')}</option>
                                <option value="haute" ${t.priorite === 'haute' ? 'selected' : ''}>${__t('high')}</option>
                                <option value="critique" ${t.priorite === 'critique' ? 'selected' : ''}>${__t('critical')}</option>
                            </select>
                        </div>

                        <div class="modal-date-item">
                            <label class="modal-section-label" for="statut-${t.id}">${__t('status')}</label>
                            <select id="statut-${t.id}" name="statut" class="tk-input tk-select">
                                <option value="en_attente" ${t.statut === 'en_attente' ? 'selected' : ''}>${__t('waiting')}</option>
                                <option value="en_cours" ${t.statut === 'en_cours' ? 'selected' : ''}>${__t('in progress')}</option>
                                <option value="en_review" ${t.statut === 'en_review' ? 'selected' : ''}>${__t('in review')}</option>
                                <option value="termine" ${t.statut === 'termine' ? 'selected' : ''}>${__t('finished')}</option>
                            </select>
                        </div>
                        
                        <div class="modal-date-item">
                            <label class="modal-section-label" for="date_fin-${t.id}"><i class="ti ti-calendar-due"></i>${__t('end')}</label>
                            <input type="datetime-local" id="date_fin-${t.id}" name="date_fin" class="tk-input" value="${formatForInput(t.date_fin)}">
                        </div>
                        
                    </div>
                </div>
                
                <div class="modal-footer tk-footer-actions">
                    <button type="button" class="tk-btn-cancel" onclick="closeModal('modal-task-modify-${t.id}')">${__t('cancel')}</button>
                    <button type="submit" class="tk-btn-save"><i class="ti ti-device-floppy"></i>${__t('save')}</button>
                </div>
            </form>
        </div>
    </div>`;
    }).join('');

    document.getElementById('tasks-zone').innerHTML = `<div class="tk-grid">${cartes}</div>${modals}${modalsModify}`;
}
function renderProjectOverview(data)  { document.getElementById('main-zone').innerHTML = travaux; }
function renderProjectKanban(data)    { document.getElementById('kanban-id').innerHTML = travaux; }
function renderProjectSprints(data)   { document.getElementById('main-zone').innerHTML = travaux; }
function renderProjectMembers(data)   { document.getElementById('main-zone').innerHTML = travaux; }
function renderProjectInsights(data)  { document.getElementById('main-zone').innerHTML = travaux; }



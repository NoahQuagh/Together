/*recherche*/
function handleSearchInput(event) {
    currentSearchQuery = event.target.value;

    const finalTasks = getFilteredTasksBySearch(activeFilteredTasks);
    renderProjectTasks({ tasks: finalTasks }, globalResData);
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.nav-item input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
    }
});

/*renderer du projet*/
function renderProjectTasks(data,resData) {
    const tasks = data.tasks || [];
    const membersList = resData.membersList ||  [];
    const labelsList = resData.labelsList || [];

    if (tasks.length === 0) {
        noTasksExist();
        return;
    }


    const cartes = data.tasks.map(t => `
    <li class="tk-card ${t.statut} ${t.isLate && myTasks(t) ? 'is-late' : ''}" onclick="openModal('modal-task-${t.id}')">
 
        <div class="tk-card-head">
            <h3 class="tk-titre">${t.titre}</h3>
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
                    <button type="button" onclick="BecomeCoWorker('${t.id}')">
                        <i class="ti ti-user-plus"></i> ${__t('become co worker')}
                    </button>
                    <div class="dropdown-divider"></div>
                    <button type="button" class="danger" onclick="deleteTask('${t.id}')">
                        <i class="ti ti-trash"></i> ${__t('delete')}
                    </button>
                </div>
            </div>
        </div>
 
        <p class="tk-card-desc">
            ${t.desc ? t.desc : `<span class="tk-desc-empty">${__t('no description')}</span>`}
        </p>
 
 
        <div class="tk-card-meta">
            <div class="tk-meta-col">
                <span class="tk-meta-label">${__t('assigned')}</span>
                <div class="tk-avatars">
                    ${(t.assignes ?? []).length > 0
        ? t.assignes.slice(0, 4).map(a =>
            `<div class="tk-avatar" title="${a.nom}">${initiales(a.nom)}</div>`
        ).join('') +
        ((t.assignes.length > 4)
            ? `<div class="tk-avatar tk-avatar-more">+${t.assignes.length - 4}</div>`
            : '')
        : `<span class="tk-unassigned"><i class="ti ti-user-off"></i>${__t('unassigned')}</span>`
    }
                </div>
            </div>
 
            <div class="tk-meta-col">
                <span class="tk-meta-label">${__t('deadline')}</span>
                <span class="tk-deadline ${t.isLate ? 'is-late-text' : ''}">
                    <i class="ti ti-calendar-event" aria-hidden="true"></i>
                    ${t.date_fin ? formatDate(t.date_fin.split(' ')[0]) : __t('not specified')}
                </span>
            </div>
        </div>
 
        <div class="tk-card-foot">
            <span class="tk-badge tk-badge-statut tk-badge-${t.statut}">
                ${statutIcon(t.statut)} ${__t(t.statut)}
            </span>
            <span class="tk-badge tk-badge-prio tk-badge-prio-${t.priorite}">
                ${__t(t.priorite)}
            </span>
            <button class="tk-quick-action" onclick="event.stopPropagation()" title="${__t('quick action')}">
                ${getActionLabel(t.statut)}
            </button>
        </div>
 
    </li>
`).join('');

    const modals = data.tasks.map(t => `
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
                                        <span class="tk-person-label" style="color:var(--color-second-primary)">${a.nom}</span>
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
            </div>
        </div>
    `).join('');

    const modalsModify = data.tasks.map(t => `
    <div id="modal-task-modify-${t.id}" class="modal-overlay tk-modify" style="display:none;" onclick="closeModalOverlay(event,'modal-task-modify-${t.id}')">
        <div class="modal-box">
            <form onsubmit="event.preventDefault();" class="tk-form-layout" id="form-task-${t.id}">
                <input type="hidden" class="id-tk" value="${t.id}" />
                
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
                        <label class="modal-section-label">${__t('task title')}</label>
                        <input type="text" class="tk-input titre-tk" value="${t.titre}" required />
                    </div>

                    <div class="modal-section modal-section-full">
                        <label class="modal-section-label">${__t('description')}</label>
                        <textarea class="tk-input tk-textarea desc-tk" placeholder="${__t('add a description')}...">${t.desc ?? ''}</textarea>
                    </div>

                    <div class="modal-section">
                        <span class="modal-section-label"><i class="ti ti-users"></i>${__t('assigned')}</span>
                        <div class="tk-people">
                            ${(t.assignes ?? []).map(a =>
        `<div class="tk-person tk-person-item tk-editable-badge" data-id="${a.id}">
                                    <div class="tk-avatar">${initiales(a.nom)}</div>
                                    <span class="tk-person-label" style="color:var(--color-second-primary)">${a.nom}</span>
                                    <button type="button" class="tk-remove-btn" onclick="removeTaskBadge(this)" title="Retirer"><i class="ti ti-x"></i></button>
                                </div>`).join('')
    }
                            <button type="button" class="tk-btn-add-badge" onclick="openAssignModal('${t.id}')"><i class="ti ti-plus"></i>${__t('add')}</button>
                        </div>
                    </div>

                    <div class="modal-section">
                        <span class="modal-section-label"><i class="ti ti-tag"></i>${__t('labels')}</span>
                        <div class="tk-etiquettes">
                            ${(t.etiquettes ?? []).map(e =>
        `<span class="tk-info-badge tk-tag-item tk-editable-badge" data-id="${e.id}" style="background:${e.couleur};color:white;">
                                    ${e.label}
                                    <button type="button" class="tk-remove-btn" onclick="removeTaskBadge(this)" title="Retirer"><i class="ti ti-x"></i></button>
                                </span>`).join('')
    }
                            <button type="button" class="tk-btn-add-badge" onclick="openTagModal('${t.id}')"><i class="ti ti-plus"></i>${__t('add')}</button>
                        </div>
                    </div>

                    <div class="modal-section modal-dates">
                        <div class="modal-date-item">
                            <label class="modal-section-label"><i class="ti ti-calendar-event"></i>${__t('beginning')}</label>
                            <input type="datetime-local" class="tk-input date_debut-tk" value="${formatForInput(t.date_debut)}">
                        </div>
                        
                        <div class="modal-date-item">
                            <label class="modal-section-label">${__t('priority')}</label>
                            <select class="tk-input tk-select priority-tk">
                                <option value="1" ${t.priorite === 'basse' ? 'selected' : ''}>${__t('low')}</option>
                                <option value="2" ${t.priorite === 'normale' ? 'selected' : ''}>${__t('normal')}</option>
                                <option value="3" ${t.priorite === 'haute' ? 'selected' : ''}>${__t('high')}</option>
                                <option value="4" ${t.priorite === 'critique' ? 'selected' : ''}>${__t('critical')}</option>
                            </select>
                        </div>

                        <div class="modal-date-item">
                            <label class="modal-section-label">${__t('status')}</label>
                            <select class="tk-input tk-select statut-tk">
                                <option value="1" ${t.statut === 'en_attente' ? 'selected' : ''}>${__t('waiting')}</option>
                                <option value="2" ${t.statut === 'en_cours' ? 'selected' : ''}>${__t('in progress')}</option>
                                <option value="3" ${t.statut === 'en_review' ? 'selected' : ''}>${__t('in review')}</option>
                                <option value="4" ${t.statut === 'termine' ? 'selected' : ''}>${__t('finished')}</option>
                            </select>
                        </div>
                        
                        <div class="modal-date-item">
                            <label class="modal-section-label"><i class="ti ti-calendar-due"></i>${__t('end')}</label>
                            <input type="datetime-local" class="tk-input date_fin-tk" value="${formatForInput(t.date_fin)}">
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer tk-footer-actions">
                    <button type="button" class="tk-btn-cancel" onclick="closeModal('modal-task-modify-${t.id}')">${__t('cancel')}</button>
                    <button type="submit" class="tk-btn-save" disabled><i class="ti ti-device-floppy"></i>${__t('save')}</button>
                </div>
            </form>
        </div>
    </div>

    <div id="modal-assign-${t.id}" class="modal-overlay" style="display:none;" onclick="closeModalOverlay(event,'modal-assign-${t.id}')">
            <div class="modal-box modal-box-sm">
                <div class="modal-header">
                    <h4>${__t('assign member')}</h4>
                    <button type="button" class="modal-close-btn" onclick="closeModal('modal-assign-${t.id}')"><i class="ti ti-x"></i></button>
                </div>
                <div class="modal-body">
                    <div class="tk-select-list">
                        ${membersList.map(m => `
                            <div class="tk-select-item" onclick="addAssigneeToTask('${t.id}', '${m.member_id}', '${m.member_nom}')">
                                <div class="tk-avatar">${initiales(m.member_nom)}</div>
                                <span>${m.member_nom}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>

        <div id="modal-tag-${t.id}" class="modal-overlay" style="display:none;" onclick="closeModalOverlay(event,'modal-tag-${t.id}')">
            <div class="modal-box modal-box-sm">
                <div class="modal-header">
                    <h4>${__t('manage labels')}</h4>
                    <button type="button" class="modal-close-btn" onclick="closeModal('modal-tag-${t.id}')"><i class="ti ti-x"></i></button>
                </div>
                <div class="modal-body">
                    <div class="tk-select-list">
                        ${labelsList.map(tag => `
                            <div class="tk-select-item" onclick="addTagToTask('${t.id}', '${tag.eti_id}', '${tag.eti_label}', '${tag.eti_couleur}')">
                                <span class="tk-info-badge" style="background:${tag.eti_couleur};color:white;">${tag.eti_label}</span>
                            </div>
                        `).join('')}
                    </div>
                    <hr class="separator-form">
                    <h5>${__t('create label')}</h5>
                    <div class="tk-create-tag-form">
                        <input type="text" id="new-tag-label-${t.id}" class="tk-input" placeholder="${__t('label name')}..." />
                        <input type="color" id="new-tag-color-${t.id}" class="tk-color-picker" value="#6c5ce7" />
                        <button type="button" class="tk-btn-ink" onclick="createAndAddTag('${t.id}')">${__t('create')}</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    document.getElementById('tasks-zone').innerHTML = `<div class="tk-grid">${cartes}</div>${modals}${modalsModify}`;
    handlerEditTask();
}
function renderProjectOverview(data)  { document.getElementById('main-zone').innerHTML = travaux; }
function renderProjectKanban(data)    { document.getElementById('kanban-id').innerHTML = travaux; }
function renderProjectSprints(data)   { document.getElementById('main-zone').innerHTML = travaux; }
function renderProjectMembers(data)   { document.getElementById('main-zone').innerHTML = travaux; }
function renderProjectInsights(data)  { document.getElementById('main-zone').innerHTML = travaux; }



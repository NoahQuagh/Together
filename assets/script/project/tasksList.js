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
            <i class="ti ti-filter-off" style="font-size: 2.5rem; color: var(--color-second-tertiary, #888);"></i>
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
let globalResData = { membersList: [], labelsList: [] };

function initProjectTasks(data) {
    // On conserve les listes si elles existent dans les données reçues
    if (data && (data.membersList || data.labelsList)) {
        globalResData = data;
    }

    currentTaskData = data.tasks || [];
    activeFilteredTasks = [...currentTaskData];

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    const searchInput = document.getElementById('task-search-input') || document.querySelector('.nav-item input[type="text"]');

    if (searchQuery) {
        currentSearchQuery = searchQuery;
        if (searchInput) {
            searchInput.value = searchQuery;
        }
    }

    const finalTasks = getFilteredTasksBySearch(activeFilteredTasks);
    renderProjectTasks({ tasks: finalTasks }, globalResData);
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

    fetch(`../api/loader/loadProjectFilter.php?${params.toString()}`)
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
                renderProjectTasks({ tasks: finalTasks }, globalResData);
            }

            closeModal('modal-task-filter');
        })
        .catch(error => {
            renderFilterError();
            closeModal('modal-task-filter');
        });
}



function myTasks(task) {
    if (!task || !task.assignes || !Array.isArray(task.assignes)) return false;

    return task.assignes.some(assignee => Number(assignee.myTask) === 1);
}

function handlerEditTask() {
    const forms = document.querySelectorAll('.tk-form-layout');
    forms.forEach(form => {
        const saveBtn = form.querySelector('.tk-btn-save');
        if (!saveBtn) return;

        const getFormState = () => {
            const state = {};
            const inputs = form.querySelectorAll('input, textarea, select');

            inputs.forEach(input => {
                if (input.type !== 'button' && input.type !== 'submit') {
                    const key = input.id || input.name || input.className;
                    state[key] = input.value.trim();
                }
            });

            const assignes = Array.from(form.querySelectorAll('.tk-person-item'))
                .map(el => el.dataset.id)
                .filter(Boolean)
                .sort();
            const etiquettes = Array.from(form.querySelectorAll('.tk-tag-item'))
                .map(el => el.dataset.id)
                .filter(Boolean)
                .sort();

            state['assignes'] = assignes.join(',');
            state['etiquettes'] = etiquettes.join(',');

            return state;
        };

        let initialState = getFormState();

        function checkChanges() {
            const currentState = getFormState();
            let hasChanged = false;

            for (const key in initialState) {
                if (initialState[key] !== currentState[key]) {
                    hasChanged = true;
                    break;
                }
            }
            saveBtn.disabled = !hasChanged;
        }

        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', checkChanges);
            input.addEventListener('change', checkChanges);
            input.addEventListener('keyup', checkChanges);
        });

        const observer = new MutationObserver(() => {
            checkChanges();
        });

        const peopleZone = form.querySelector('.tk-people');
        const tagZone = form.querySelector('.tk-etiquettes');

        if (peopleZone) observer.observe(peopleZone, { childList: true, subtree: true });
        if (tagZone) observer.observe(tagZone, { childList: true, subtree: true });

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const taskId = form.querySelector('.id-tk')?.value;
            const payload = {
                tk_id: taskId,
                tk_title: form.querySelector('.titre-tk')?.value.trim(),
                tk_desc: form.querySelector('.desc-tk')?.value.trim(),
                tk_date_start: form.querySelector('.date_debut-tk')?.value,
                tk_date_end: form.querySelector('.date_fin-tk')?.value,
                tk_prio: form.querySelector('.priority-tk')?.value,
                tk_status: form.querySelector('.statut-tk')?.value,
                assignes: Array.from(form.querySelectorAll('.tk-person-item')).map(el => el.dataset.id),
                etiquettes: Array.from(form.querySelectorAll('.tk-tag-item')).map(el => el.dataset.id)
            };

            fetch('../api/updater/updateTask_project.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(res => res.json())
                .then(res => {
                    if (!res.success) {
                        showToast('Modification impossible', 'warning', res.message);
                        return;
                    }
                    showToast('Modification réussie', 'success', res.message);
                    closeModal(`modal-task-modify-${taskId}`);
                    refreshProjectTasks();
                })
                .catch(() => {
                    showToast(__t('unable to edit task'), 'error');
                });
        });
    });
}


function removeTaskBadge(btn) {
    const badge = btn.closest('.tk-editable-badge');
    if (badge) badge.remove();
}


function openAssignModal(taskId) {
    openModal(`modal-assign-${taskId}`);
}


function openTagModal(taskId) {
    openModal(`modal-tag-${taskId}`);
}

function addAssigneeToTask(taskId, memberId, memberNom) {
    const container = document.querySelector(`#form-task-${taskId} .tk-people`);
    if (!container) return;

    if (container.querySelector(`.tk-person-item[data-id="${memberId}"]`)) {
        closeModal(`modal-assign-${taskId}`);
        return;
    }

    const badge = document.createElement('div');
    badge.className = 'tk-person tk-person-item tk-editable-badge';
    badge.dataset.id = memberId;
    badge.innerHTML = `
        <div class="tk-avatar">${initiales(memberNom)}</div>
        <span class="tk-person-label" style="color:var(--color-second-primary)">${memberNom}</span>
        <button type="button" class="tk-remove-btn" onclick="removeTaskBadge(this)" title="Retirer"><i class="ti ti-x"></i></button>
    `;

    const addBtn = container.querySelector('.tk-btn-add-badge');
    container.insertBefore(badge, addBtn);
    closeModal(`modal-assign-${taskId}`);
}

function addTagToTask(taskId, tagId, tagLabel, tagColor) {
    const container = document.querySelector(`#form-task-${taskId} .tk-etiquettes`);
    if (!container) return;

    if (container.querySelector(`.tk-tag-item[data-id="${tagId}"]`)) {
        closeModal(`modal-tag-${taskId}`);
        return;
    }

    const badge = document.createElement('span');
    badge.className = 'tk-info-badge tk-tag-item tk-editable-badge';
    badge.dataset.id = tagId;
    badge.style.background = tagColor;
    badge.style.color = 'white';
    badge.innerHTML = `
        ${tagLabel}
        <button type="button" class="tk-remove-btn" onclick="removeTaskBadge(this)" title="Retirer"><i class="ti ti-x"></i></button>
    `;

    const addBtn = container.querySelector('.tk-btn-add-badge');
    container.insertBefore(badge, addBtn);
    closeModal(`modal-tag-${taskId}`);
}


function createAndAddTag(taskId) {//TODO a faire
    const labelInput = document.getElementById(`new-tag-label-${taskId}`);
    const colorInput = document.getElementById(`new-tag-color-${taskId}`);
    if (!labelInput || !labelInput.value.trim()) return;

    const label = labelInput.value.trim();
    const color = colorInput ? colorInput.value : '#6c5ce7';

    fetch('../api/updater/createTag.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, color })
    })
        .then(res => res.json())
        .then(res => {
            if (res.success && res.tag_id) {
                addTagToTask(taskId, res.tag_id, label, color);
                labelInput.value = '';
            } else {
                showToast('Erreur de création d\'étiquette', 'warning', res.message);
            }
        })
        .catch(() => {
            showToast('Erreur réseau', 'error');
        });
}

function refreshProjectTasks() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectKey = urlParams.get('key');

    if (!projectKey) return;

    fetch(`../api/loader/loadProject.php?project=${projectKey}`)
        .then(res => res.json())
        .then(res => {
            if (!res.success) {
                throw new Error(res.message);
            }
            if (res.success && res.data) {
                initProjectTasks(res.data);
            }
        })
        .catch(err => showToast('Erreur lors de la mise à jour des tâches', 'error'));
}
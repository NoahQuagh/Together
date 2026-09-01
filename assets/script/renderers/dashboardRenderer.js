
function renderDashboard(data){
    document.getElementById('dashboard-container').innerHTML = `
        <div class="dash-layout">
    <div class="dash-kpi-grid">

    <div class="dash-kpi-card">
    <div class="dash-kpi-icon dash-kpi-icon--blue">
    <i class="ti ti-checklist" aria-hidden="true"></i>
    </div>
    
    <div class="dash-kpi-info">
    <span class="dash-kpi-value" id="kpi-tasks-today">${data.tasks_today.length}</span>
    <span class="dash-kpi-label">${__t('tasks to do')}</span>
</div>
</div>

<div class="dash-kpi-card">
    <div class="dash-kpi-icon dash-kpi-icon--red">
        <i class="ti ti-alert-triangle" aria-hidden="true"></i>
    </div>
    <div class="dash-kpi-info">
        <span class="dash-kpi-value" id="kpi-tasks-late">${data.tasks_late.length}</span>
        <span class="dash-kpi-label">${__t('overdue tasks')}</span>
    </div>
</div>

<div class="dash-kpi-card">
    <div class="dash-kpi-icon dash-kpi-icon--green">
        <i class="ti ti-circle-check" aria-hidden="true"></i>
    </div>
    <div class="dash-kpi-info">
        <span class="dash-kpi-value" id="kpi-tasks-done">${data.nb_done_month}</span>
        <span class="dash-kpi-label">${__t('completed this month')}</span>
    </div>
</div>

<div class="dash-kpi-card">
    <div class="dash-kpi-icon dash-kpi-icon--yellow">
        <i class="ti ti-folder" aria-hidden="true"></i>
    </div>
    <div class="dash-kpi-info">
        <span class="dash-kpi-value" id="kpi-projects-on">${data.project_on.length}</span>
        <span class="dash-kpi-label">${__t('active projects')}</span>
    </div>
</div>

</div>


<div class="dash-grid" id="tab">

    <div class="dash-block" id="tasks-today">${renderTasksToday(data.tasks_today)}</div>

    <div class="dash-block" id="tasks-late">${renderTasksLate(data.tasks_late)}</div>

    <div class="dash-block" id="sprints">${renderSprints(data.sprint)}</div>

    <div class="dash-block" id="project-on">${renderProjects(data.project_on)}</div>

    <div class="dash-block dash-block--full" id="activities">${renderActivities(data.activity_project)}</div>
</div>
</div>
    `
}

function prioriteBadge(prio) {
    const map = { critique: 'badge-red', haute: 'badge-yellow', normale: 'badge-blue' };
    return map[prio] || 'badge-green';
}
function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR');
}

function renderTasksToday(tasks){
    if (tasks.length === 0) {
        return `<p class="dash-empty"><i class="ti ti-coffee"></i>${__t("no tasks assigned. It's officially coffee break time")}.</p>`;
    }
    return`
    <div class="dash-block-header bleu">
            <h3><i class="ti ti-checklist" aria-hidden="true"></i>${__t('my tasks')}</h3>
            <span class="dash-block-count">${tasks.length}</span>
        </div>
        
        <ul class="dash-task-list">
            ${tasks.map(t => `
            <li class="dash-task-item">
                <div class="dash-task-top">
                    <span class="dash-task-titre">${escapeHtml(t.tache)}</span>
                    <span class="badge ${prioriteBadge(t.priorite)}">${escapeHtml(t.priorite)}</span>
                </div>
                <div class="dash-task-meta">
                    <span><i class="ti ti-folder"></i> ${escapeHtml(t.projet)}</span>
                    <span><i class="ti ti-calendar"></i> ${formatDate(t.deadline)}</span>
                </div>
            </li>
            `).join('')}
        </ul>`;
}

function renderTasksLate(tasks){
    if (tasks.length === 0) {
        return `<p class="dash-empty"><i class="ti ti-confetti"></i>${__t('no overdue tasks')}.</p>`;

    }
    return`<div class="dash-block-header rouge">
            <h3><i class="ti ti-alert-triangle" aria-hidden="true"></i>${__t('late')}</h3>
            <span class="dash-block-count dash-block-count--red">${tasks.length}</span>
        </div>
        
        <ul class="dash-task-list">
            ${tasks.map(t => `
                <li class="dash-task-item dash-task-item--late">
                    <div class="dash-task-top">
                        <span class="dash-task-titre">${escapeHtml(t.tache)}</span>
                        <span class="badge ${prioriteBadge(t.priorite)}">${escapeHtml(t.priorite)}</span>
                    </div>
                    <div class="dash-task-meta">
                        <span><i class="ti ti-folder"></i> ${escapeHtml(t.projet)}</span>
                        <span class="dash-late-date"><i class="ti ti-clock"></i> Deadline : ${formatDate(t.deadline)}</span>
                    </div>
                </li>
            `).join('')}
        </ul>`;
}

function renderSprints(sprints){
    if (sprints.length === 0) {
        return `<p class="dash-empty">${__t('no active sprint at the moment')}.</p>`;
    }
    return `<div class="dash-block-header gris">
            <h3><i class="ti ti-run" aria-hidden="true"></i>${__t('sprints in progress')}</h3>
            <span class="dash-block-count">${sprints.length}</span>
        </div>

        <ul class="dash-sprint-list">
            ${sprints.map(s => `
                <li class="dash-sprint-item">
                    <div class="dash-sprint-top">
                        <span class="dash-sprint-nom">${escapeHtml(s.sprint)}</span>
                    </div>
                    <div class="dash-task-meta">
                        <span><i class="ti ti-folder"></i> ${escapeHtml(s.projet)}</span>
                        <span><i class="ti ti-calendar"></i>${__t('end')} : ${formatDate(s.deadline)}</span>
                    </div>
                </li>
            `).join('')}
        </ul>`;
}

function renderProjects(projects){
    if (projects.length === 0) {
        return `<p class="dash-empty">${__t('you are not participating in any active projects')}.</p>`;
    }
    return `<div class="dash-block-header jaune">
            <h3><i class="ti ti-folder" aria-hidden="true"></i>${__t('active projects')}</h3>
            <span class="dash-block-count">${projects.length}</span>
        </div>

        <ul class="dash-project-list">
            ${projects.map(p => `
                <li class="dash-project-item">
                    <span class="dash-project-nom">${escapeHtml(p.nom)}</span>
                    <span class="badge badge-blue">${escapeHtml(p.role)}</span>
                </li>
            `).join('')}
        </ul>`;
}

function renderActivities(activities){
    if (activities.length === 0) {
        return `<p class="dash-empty">${__t('no recent activity on your projects')}.</p>`;
    }
    return `<div class="dash-block-header vert">
            <h3><i class="ti ti-activity" aria-hidden="true"></i>${__t('recent activity')}</h3>
        </div>

        <ul class="dash-activity-list">
            ${activities.map(a => `
                <li class="dash-activity-item">
                    <span class="dash-activity-dot"></span>
                    <div class="dash-activity-content">
                        <span class="dash-activity-desc">${escapeHtml(a.description_log)}</span>
                        <div class="dash-task-meta">
                            <span><i class="ti ti-folder"></i> ${escapeHtml(a.projet)}</span>
                            <span><i class="ti ti-clock"></i> ${formatDate(a.cree_le)}</span>
                        </div>
                    </div>
                </li>
            `).join('')}
        </ul>`;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

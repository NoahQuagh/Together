function renderMyTasks(data){
    document.getElementById('dashboard-container').innerHTML = `
    <div class="proj-page">

    <div class="tasks-filter-box">
        <div class="proj-filters">
            <button class="proj-filter-btn active" data-filter="tout"><i class="ti ti-layout-grid"></i>${__t('all')}</button>
            <button class="proj-filter-btn" data-filter="attente"><i class="ti ti-loader"></i>${__t('waiting')}</button>
            <button class="proj-filter-btn" data-filter="encours"><i class="ti ti-circle-dashed"></i>${__t('in progress')}</button>
            <button class="proj-filter-btn" data-filter="review"><i class="ti ti-telescope"></i>${__t('in review')}</button>
          </div>
          <div class="proj-filters">
            <button class="proj-filter-btn active" data-filter="tout"><i class="ti ti-layout-grid"></i>${__t('all')}</button>
            <button class="proj-filter-btn" data-filter="basse">${__t('basse')}</button>
            <button class="proj-filter-btn" data-filter="normale">${__t('normale')}</button>
            <button class="proj-filter-btn" data-filter="haute">${__t('haute')}</button>
            <button class="proj-filter-btn" data-filter="critique">${__t('critique')}</button>
          </div>
    </div>
  
  ${tasksExist(data.length)}
  <ul class="mytasks-list" id="tasksList">
    ${data.map(t=> `
        ${renderTasks(t)}
    `).join('')}
  </ul>
    
    <div class="dash-empty proj-empty-filtered" id="emptyFiltered" style="display:none;">
      <i class="ti ti-filter-off" aria-hidden="true"></i>
      <p>${__t('no tasks match this filter')}.</p>
    </div>
    
    </div>
    `;
}

function formatDateTime(dateInput) {
    if (!dateInput) return '';

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';


    return date.toLocaleDateString(__t('formatDate'), {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}


function tasksExist(l){
    return ``;
}


function renderTasks(d){
    return`
    <li class="tasks-card ${d.isLate ? 'is-late' : ''}" data-statut="${escapeHtml(d.statut)}" data-prio="${escapeHtml(d.prio)}" data-id="${escapeHtml(d.projet_uuid)}" onclick="window.location.href='project.php?key=${escapeHtml(d.projet_uuid)}&tab=tasks&search=${escapeHtml(d.titre_tache)}'">
        <div class="tasks-header">
          <div class="header-item">
            <div><i class="ti ti-clipboard-list"></i>${d.titre_tache}</div>
            <div><i class="ti ti-folder"></i>${d.projet_nom}</div>
          </div>
            <i class="ti ti-external-link"></i>
        </div>
        <div class="tasks-body">
          <div>${d.desc_tache}</div>
        </div>
        <div class="tasks-footer">
          <div class="footer-item">
              <div>${formatDateTime(d.date_debut)}</div>
              <div>${formatDateTime(d.date_fin)}</div>
          </div>
          <div>${d.reporter}</div>
        </div>
    </li>`;
}
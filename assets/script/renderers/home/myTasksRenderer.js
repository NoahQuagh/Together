function renderMyTasks(data){
    document.getElementById('dashboard-container').innerHTML = `
    <div class="proj-page">

    <div class="tasks-filter-box">
        <div class="proj-filters" data-filter-type="statut">
            <button class="proj-filter-btn active" data-filter="tout"><i class="ti ti-layout-grid"></i>${__t('all')}</button>
            <button class="proj-filter-btn" data-filter="attente"><i class="ti ti-loader"></i>${__t('waiting')}</button>
            <button class="proj-filter-btn" data-filter="encours"><i class="ti ti-circle-dashed"></i>${__t('in progress')}</button>
            <button class="proj-filter-btn" data-filter="review"><i class="ti ti-telescope"></i>${__t('in review')}</button>
        </div>
        <div class="proj-filters" data-filter-type="prio">
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
    filtrerTache();
}

function tasksExist(l){
    return ``;
}

function renderTasks(d){
    const statutNormalized = normalizeStatut(d.statut);
    const prioNormalized = normalizePrio(d.prio);

    return`
    <li class="tasks-card ${d.isLate ? 'is-late' : ''}" 
      data-statut="${escapeHtml(statutNormalized)}" 
      data-prio="${escapeHtml(prioNormalized)}"
      data-id="${escapeHtml(d.projet_uuid)}" 
      onclick="window.location.href='project.php?key=${escapeHtml(d.projet_uuid)}&tab=tasks&search=${escapeHtml(d.titre_tache)}'">
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
              <div>${formatDateTime(d.date_fin)}</div>
          </div>
          <div>${d.reporter}</div>
        </div>
    </li>`;
}

function filtrerTache() {
    const filterGroups = document.querySelectorAll('.proj-filters');
    const items        = document.querySelectorAll('#tasksList .tasks-card');
    const emptyMsg     = document.getElementById('emptyFiltered');
    const list         = document.getElementById('tasksList');

    if (!filterGroups.length || !items.length) return;

    filterGroups.forEach(group => {
        const buttons = group.querySelectorAll('.proj-filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                appliquerFiltres();
            });
        });
    });

    function appliquerFiltres() {
        // Identification explicite des conteneurs via data-filter-type
        const statutGroup = document.querySelector('.proj-filters[data-filter-type="statut"]');
        const prioGroup   = document.querySelector('.proj-filters[data-filter-type="prio"]');

        const activeStatutBtn = statutGroup?.querySelector('.proj-filter-btn.active');
        const activePrioBtn   = prioGroup?.querySelector('.proj-filter-btn.active');

        const selectedStatut = activeStatutBtn ? activeStatutBtn.dataset.filter : 'tout';
        const selectedPrio   = activePrioBtn ? activePrioBtn.dataset.filter : 'tout';

        let visibleCount = 0;

        items.forEach(item => {
            const itemStatut = item.dataset.statut;
            const itemPrio   = item.dataset.prio;

            // Comparaison combinée (AND)
            const matchStatut = selectedStatut === 'tout' || itemStatut === selectedStatut;
            const matchPrio   = selectedPrio === 'tout' || itemPrio === selectedPrio;

            if (matchStatut && matchPrio) {
                item.style.display = '';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        if (emptyMsg) emptyMsg.style.display = visibleCount === 0 ? 'flex' : 'none';
        if (list)     list.style.display     = visibleCount === 0 ? 'none' : '';
    }
}
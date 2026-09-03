function renderMyContributions(data){
    document.getElementById('dashboard-container').innerHTML = `<div class="proj-page">

  <div class="proj-filters">
    <button class="proj-filter-btn active" data-filter="tout"><i class="ti ti-layout-grid"></i>${__t('all')}</button>
    <button class="proj-filter-btn" data-filter="actif"><i class="ti ti-activity"></i>${__t('active')}</button>
    <button class="proj-filter-btn" data-filter="pause"><i class="ti ti-player-pause"></i>${__t('paused')}</button>
    <button class="proj-filter-btn" data-filter="termine"><i class="ti ti-check"></i>${__t('finished')}</button>
  </div>

  ${projectExist(data.length)}

    <div class="dash-project-list proj-list" id="projectList">
      ${data.map(p => `
         ${contributionRenderer(p)}
      `).join('')}
    </div>

    <div class="dash-empty proj-empty-filtered" id="emptyFiltered" style="display:none;">
      <i class="ti ti-filter-off" aria-hidden="true"></i>
      <p>${__t('no projects match this filter')}.</p>
    </div>

</div>`;
    projet();
}
function projectExist(l){
    if(l===0){
        return `<div class="dash-empty proj-empty-global">
      <i class="ti ti-folder-off" aria-hidden="true"></i>
      <p>${__t("you don't have any contributions yet")}.</p>
    </div>`;
    }else{
        return '';
    }
}
function contributionRenderer(project){
    return `
        <li class="dash-project-item proj-item"
            data-statut="${escapeHtml(project.project_statut_label)}"
            data-id="${escapeHtml(project.project_uuid)}" onclick="window.location.href='project.php?key=${escapeHtml(project.project_uuid)}'">

          <div class="proj-item-main">
                        <span class="dash-project-nom">
                            <i class="ti ti-folder"></i>
                            ${escapeHtml(project.project_nom)}
                            <span class="badge ${statutBadge(project.project_statut_label)} proj-statut-badge">
                                ${__t(project.project_statut_label)}
                            </span>
                        </span>

            ${descriptionRenderer(project.project_description)}

            <div class="proj-item-meta">
              ${deadlineRenderer(project.project_fin)}
            </div>
            
          </div>

          <div class="optionProject">
            <!-- Supprimer -->
            <button class="option-btn option-red btn-delete"
                    data-id="${escapeHtml(project.project_id)}"
                    data-nom="${escapeHtml(project.project_nom)}"
                    title="${__t('leave the project')}"
                    onclick="preparerSortie(${escapeHtml(project.project_id)}, this)">
              <i class="ti ti-door-exit"></i>
            </button>

          </div>
        </li>
    `;
}
function descriptionRenderer(desc){
    if (!desc || desc.trim() === '') {
        return '';
    }
    return `<span class="proj-desc">${escapeHtml(desc)}</span>`;
}
function deadlineRenderer(date) {
    if (!date || String(date).trim() === '') {
        return '';
    }

    return `
        <span class="proj-date">
            <i class="ti ti-calendar" aria-hidden="true"></i>
            ${formatDate(date)}
        </span>
    `;
}
function statutBadge(statut) {
    switch (statut) {
        case 'actif':   return 'badge-green';
        case 'pause':   return 'badge-yellow';
        case 'termine': return 'badge-blue';
        default:        return 'badge-blue';
    }
}
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
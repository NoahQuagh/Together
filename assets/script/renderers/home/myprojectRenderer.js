function renderMyProject(data){

    document.getElementById('dashboard-container').innerHTML = `<div class="proj-page">

  <div class="proj-filters">
    <button class="proj-filter-btn active" data-filter="tout"><i class="ti ti-layout-grid"></i>${__t('all')}</button>
    <button class="proj-filter-btn" data-filter="actif"><i class="ti ti-activity"></i>${__t('active')}</button>
    <button class="proj-filter-btn" data-filter="pause"><i class="ti ti-player-pause"></i>${__t('paused')}</button>
    <button class="proj-filter-btn" data-filter="termine"><i class="ti ti-check"></i>${__t('finished')}</button>
  </div>

  ${projectExist(data.length)}

    <ul class="dash-project-list proj-list" id="projectList">
      ${data.map(p => `
         ${projectRenderer(p)}
      `).join('')}
    </ul>

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
      <p>${__t("You haven't created any projects yet")}.</p>
      <div>
        <button class="proj-create-btn" onclick="window.location.href='../pages/project_create.php'">
          <i class="ti ti-plus"></i>
          ${__t('create my first project')}
        </button>
      </div>
    </div>`;
    }else{
        return '';
    }
}
function projectRenderer(project){
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
          
            <button class="option-btn option-vert btn-edit"
                    data-id="${escapeHtml(project.project_id)}"
                    title="${__t('modify the project')}">
              <i class="ti ti-pencil"></i>
            </button>

            <div class="more-wrapper">
              <button class="option-btn option-blanc btn-more"
                      data-id="${escapeHtml(project.project_id)}"
                      title="${__t('change status')}">
                <i class="ti ti-dots"></i>
              </button>
              
              <div class="more-dropdown">
                <a href="#" class="more-dropdown-item" data-statut="actif">
                  <i class="ti ti-activity"></i>${__t('active')}
                </a>
                
                <a href="#" class="more-dropdown-item" data-statut="pause">
                  <i class="ti ti-player-pause"></i>${__t('paused')}
                </a>
                
                <a href="#" class="more-dropdown-item" data-statut="termine">
                  <i class="ti ti-check"></i>${__t('finished')}
                </a>
              </div>
            </div>

            <button class="option-btn option-red btn-delete"
                    data-id="${escapeHtml(project.project_id)}"
                    data-nom="${escapeHtml(project.project_nom)}"
                    title="${__t('delete the project')}"
                    onclick="event.stopPropagation(); openModal('supProjet_${project.project_uuid}'); saveBtn(this)">
              <i class="ti ti-trash"></i>
            </button>

          </div>
        </li>
        <div id="supProjet_${project.project_uuid}" class="modal-overlay" style="display: none;">
            <div class="modal-box">
        
              <div class="modal-header">
                <h3>${__t('delete the project')} ?</h3>
                <button class="modal-close-btn" onclick="closeModal('supProjet_${project.project_uuid}')">
                  <i class="ti ti-x"></i>
                </button>
              </div>
        
              <div class="modal-body">
                <p>${__t('are you sure you want to delete this project ? This action is irreversible')} ?</p>
              </div>
        
              <div class="modal-footer">
                <button class="modal-btn btn-cancel" onclick="closeModal('supProjet_${project.project_uuid}')">${__t('cancel')}</button>
                <button class="modal-btn btn-confirm risk" onclick="supprimerProjet('${project.project_uuid}')">${__t('confirm')}</button>
              </div>
        
            </div>
          </div>
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





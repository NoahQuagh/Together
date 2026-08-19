


function renderMyProject(data){
    document.getElementById('dashboard-container').innerHTML = `<div class="proj-page">

  <div class="proj-filters">
    <button class="proj-filter-btn active" data-filter="tout"><i class="ti ti-layout-grid"></i>Tout</button>
    <button class="proj-filter-btn" data-filter="actif"><i class="ti ti-activity"></i>Actif</button>
    <button class="proj-filter-btn" data-filter="pause"><i class="ti ti-player-pause"></i>Pause</button>
    <button class="proj-filter-btn" data-filter="termine"><i class="ti ti-check"></i>Terminé</button>
  </div>

  ${projectExist(data.length)}

    <div class="dash-project-list proj-list" id="projectList">
      ${data.map(p => `
         ${projectRenderer(p)}
      `).join('')}
    </div>

    <div class="dash-empty proj-empty-filtered" id="emptyFiltered" style="display:none;">
      <i class="ti ti-filter-off" aria-hidden="true"></i>
      <p>Aucun projet ne correspond à ce filtre.</p>
    </div>

</div>`;
    projet();
}

function projectExist(l){
    if(l===0){
        return `<div class="dash-empty proj-empty-global">
      <i class="ti ti-folder-off" aria-hidden="true"></i>
      <p>Vous n'avez encore créé aucun projet.</p>
      <div>
        <button class="proj-create-btn" onclick="window.location.href='../../project/create.php'">
          <i class="ti ti-plus"></i>
          Créer mon premier projet
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
            data-id="${escapeHtml(project.project_uuid)}">

          <div class="proj-item-main">
                        <span class="dash-project-nom">
                            <i class="ti ti-folder"></i>
                            ${escapeHtml(project.project_nom)}
                            <span class="badge ${statutBadge(project.project_statut_label)} proj-statut-badge">
                                ${escapeHtml(project.project_statut_label)}
                            </span>
                        </span>

            ${descriptionRenderer(project.project_description)}

            <div class="proj-item-meta">
              ${deadlineRenderer(project.project_fin)}
            </div>
            
          </div>

          <div class="optionProject">
          
            <!-- Éditer -->
            <button class="option-btn option-vert btn-edit"
                    data-id="${escapeHtml(project.project_id)}"
                    title="Modifier le projet">
              <i class="ti ti-pencil"></i>
            </button>

            <!-- Changer le statut -->
            <div class="more-wrapper">
              <button class="option-btn option-blanc btn-more"
                      data-id="${escapeHtml(project.project_id)}"
                      title="Changer le statut">
                <i class="ti ti-dots"></i>
              </button>
              
              <div class="more-dropdown">
                <a href="#" class="more-dropdown-item" data-statut="actif">
                  <i class="ti ti-activity"></i>Actif
                </a>
                
                <a href="#" class="more-dropdown-item" data-statut="pause">
                  <i class="ti ti-player-pause"></i>Pause
                </a>
                
                <a href="#" class="more-dropdown-item" data-statut="termine">
                  <i class="ti ti-check"></i>Terminé
                </a>
              </div>
            </div>

            <!-- Supprimer -->
            <button class="option-btn option-red btn-delete"
                    data-id="${escapeHtml(project.project_id)}"
                    data-nom="${escapeHtml(project.project_nom)}"
                    title="Supprimer le projet"
                    onclick="preparerSuppression(${escapeHtml(project.project_id)}, this)">
              <i class="ti ti-trash"></i>
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




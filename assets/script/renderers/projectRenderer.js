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

function initiales(nom) {
    return nom.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

function renderProjectTasks(data){
    document.getElementById('main-zone').innerHTML=`
        <div class="zone-top">
          <h1 class="zone-title">Tâches</h1>
          <div>
              <button class="btn-new-tas"><i class="ti ti-plus"></i>Nouvelle tâche</button>
          </div>
        </div>
        <div class="tk-grid">
          ${data.tasks.map(t => `
            <div class="tk-card ${t.statut}" style="background: ${t.couleur}">
                <div class="tk-top">
                    <div class="tk-badges">
                        <div>
                          <span class="tk-info-badge">${t.priorite}</span>
                          <span class="tk-info-badge">${t.statut}</span>
                        </div>
                        <div class="zone-trash"><i class="ti ti-trash"></i></div>
                    </div>
                    <span class="tk-titre">${t.titre}</span>
                </div>
                        
                <div class="tk-bottom">
                    <div class="tk-line">
                         <div class="tk-people">
                              <div class="tk-person">
                                <div class="tk-avatar">${initiales(t.assigner)}</div>
                                <span class="tk-person-label">${t.assigner}</span>
                              </div>
                        </div>
                    
                         <div class="tk-meta">
                            <span class="tk-meta-item">
                                <div>
                                    <i class="ti ti-calendar" aria-hidden="true"></i>
                                    <span class="tk-date">${t.date_fin ? t.date_fin.split(' ')[0].replaceAll('-', '/') : ''}</span>
                                </div>   
                                <div>
                                    <i class="ti ti-clock" aria-hidden="true"></i>
                                    <span class="tk-time">${t.date_fin && t.date_fin.split(' ')[1] ? t.date_fin.split(' ')[1].slice(0, 5) : ''}</span>
                                </div> 
                            </span>
                        </div>
                    </div>
                    <div class="btn-option-tas">
                          <button class="tk-btn-wh"><i class="ti ti-info-circle" aria-hidden="true"></i>Voir Détails</button>
                          
                          <button class="tk-btn-ink">${getActionLabel(t.statut)}</button>
                    </div>
                </div>        
            </div>`).join('')} 
        </div>
    `;
}

function renderProjectOverview(data){
    document.getElementById('main-zone').innerHTML=`overview`;
}

function renderProjectKanban(data){
    document.getElementById('main-zone').innerHTML=`kanban`;
}

function renderProjectCalendar(data){
    document.getElementById('main-zone').innerHTML=`calendar`;
}

function renderProjectSprints(data){
    document.getElementById('main-zone').innerHTML=`sprints`;
}

function renderProjectMembers(data){
    document.getElementById('main-zone').innerHTML=`members`;
}

function renderProjectInsights(data){
    document.getElementById('main-zone').innerHTML=`insights`;
}

function getActionLabel(statut) {
    switch (statut) {
        case 'a_faire':  return '<i class="ti ti-player-play" aria-hidden="true"></i>Commencer';
        case 'en_cours': return '<i class="ti ti-pencil-check" aria-hidden="true"></i>Valider';
        case 'review': return '<i class="ti ti-circle-check" aria-hidden="true"></i>Terminer'
        default:         return '<i class="ti ti-arrow-back-up" aria-hidden="true"></i>Annuler';
    }
}




<div id="modalNewProject" class="modal-overlay" style="display: none;">
  <div class="modal-box modalNewProject">

    <div class="modal-header">
      <button id="btn-back-type" class="btn-back is-hidden" onclick="resetToTypeSelection()" title="Retour au choix">
        <i class="ti ti-arrow-left"></i>
      </button>
      <h3><i class="ti ti-folder-plus" aria-hidden="true"></i>Créer un nouveau projet</h3>
      <button class="modal-close-btn" onclick="closeModal('modalNewProject')">
        <i class="ti ti-x"></i>
      </button>
    </div>

    <div class="modal-body" id="modalNP-zone">
      <div class="slider-container" id="modalNP-slider">

        <div class="step-select-type">
          <div class="layout-select-type">
            <h2>Type de projet</h2>

            <div class="card-type-project" style="grid-area: card1" onclick="selectClassicProject()">
              <div class="icon-type"><i class="ti ti-folders"></i></div>
              <div class="text-zone">
                <h3>Classique</h3>
                <p>Organisation complète de vos projets : listes détaillées, gestion Kanban, vue Calendrier et pilotage de Sprints.</p>
              </div>
            </div>

            <div class="card-type-project disable" style="grid-area: card2">
              <div class="icon-type"><i class="ti ti-building-factory-2"></i></div>
              <div class="text-zone">
                <h3>Projet d'Affaire <span class="comingSoon">BIENTOT DISPONIBLE</span></h3>
                <p>Gamme d'usinage, dépendance entre étapes et décalage automatique.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="step-form-content" id="step-form-content"></div>

      </div>
    </div>

    <div class="modal-footer">
      <button class="modal-btn btn-cancel" onclick="closeModal('modalNewProject')">Annuler</button>
      <button class="modal-btn btn-confirm" onclick="createProject()" disabled >Créer</button>
    </div>

  </div>
</div>
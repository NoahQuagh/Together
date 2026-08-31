<section class="header-disposition-bottom tasks-list">

    <div class="header-disposition-line">

        <a href="<?= $baseUrl ?>&tab=tasks" class="<?= $tab === 'tasks' ? 'nav-item active-nav' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-list" aria-hidden="true"></i>
                <h4>Liste</h4>
            </div>
        </a>

        <a href="<?= $baseUrl ?>&tab=kanban" class="<?= $tab === 'kanban' ? 'nav-item active-nav' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-layout-kanban" aria-hidden="true"></i>
                <h4>Kanban</h4>
            </div>
        </a>

        <a href="<?= $baseUrl ?>&tab=calendar" class="<?= $tab === 'calendar' ? 'nav-item active-nav' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-calendar-week" aria-hidden="true"></i>
                <h4>Calendrier</h4>
            </div>
        </a>

    </div>
    <div class="header-disposition-line tk-list-option">

      <?php if($tab === 'tasks'): ?>
      <div class="nav-item tk-search">
        <i class="ti ti-search" aria-hidden="true"></i>
        <input type="text" placeholder="Rechercher une Tâche...">
      </div>

        <div class="nav-item tk-filter-container">
          <button type="button" class="btn-filter-trigger item" onclick="openModal('modal-task-filter')">
            <span></span>
            <i class="ti ti-filter"></i>
            <span>Filtres</span>
            <span id="filter-count"></span>
          </button>
        </div>
        <div id="modal-task-filter" class="modal-overlay tk-modify" style="display:none;" onclick="closeModalOverlay(event, 'modal-task-filter')">
          <div class="modal-box modal-filter-box">
            <div class="modal-header">
              <div class="modal-header-meta">
                <h4><i class="ti ti-adjustments-horizontal"></i> Filtrer et trier les tâches</h4>
              </div>
              <button type="button" class="modal-close-btn" onclick="closeModal('modal-task-filter')">
                <i class="ti ti-x"></i>
              </button>
            </div>

            <div class="modal-body filter-grid">

              <div class="modal-section">
                <label class="modal-section-label"><i class="ti ti-sort-ascending font-icon"></i> Ordre alphabétique</label>
                <select id="filter-sort-title" class="tk-input tk-select">
                  <option value="">Aucun tri</option>
                  <option value="asc">A à Z</option>
                  <option value="desc">Z à A</option>
                </select>
              </div>

              <div class="modal-section">
                <label class="modal-section-label"><i class="ti ti-loader"></i> Statut</label>
                <select id="filter-statut" class="tk-input tk-select">
                  <option value="">Tous les statuts</option>
                  <option value="1">En attente</option>
                  <option value="2">En cours</option>
                  <option value="3">En review</option>
                  <option value="4">Terminé</option>
                </select>
              </div>

              <div class="modal-section">
                <label class="modal-section-label"><i class="ti ti-alert-triangle"></i> Priorité</label>
                <select id="filter-priorite" class="tk-input tk-select">
                  <option value="">Toutes les priorités</option>
                  <option value="4">Critique</option>
                  <option value="3">Haute</option>
                  <option value="2">Normale</option>
                  <option value="1">Basse</option>
                </select>
              </div>

              <div class="modal-section">
                <label class="modal-section-label"><i class="ti ti-user"></i> Assigné à</label>
                <select id="filter-assignee" class="tk-input tk-select">
                  <option value="">Tous les membres</option>
                  <?php foreach ($membres as $membre): ?>
                    <!-- La valeur (value) contient l'ID, le texte visible affiche le nom -->
                    <option value="<?= htmlspecialchars($membre['id']) ?>">
                      <?= htmlspecialchars($membre['nom']) ?>
                    </option>
                  <?php endforeach; ?>
                </select>
              </div>

              <div class="modal-section modal-section-full">
                <label class="modal-section-label"><i class="ti ti-calendar-due"></i> Échéance (Date de fin)</label>
                <div class="filter-date-group">
                  <input type="date" id="filter-date-start" class="tk-input" placeholder="Du">
                  <span>au</span>
                  <input type="date" id="filter-date-end" class="tk-input" placeholder="Au">
                </div>
              </div>
            </div>

            <div class="modal-footer tk-footer-actions">
              <button type="button" class="tk-btn-cancel" onclick="resetFilters()">Réinitialiser</button>
              <button type="button" class="tk-btn-save" onclick="applyFilters()">Appliquer les filtres</button>
            </div>
          </div>
        </div>
      <?php endif; ?>

      <?php if($tab === 'calendar'): ?>
        <div class="nav-item">
          <button class="item">Vue Verticale</button>
        </div>
      <?php endif; ?>

      <div class="nav-item">
        <button class="item add-tasks"><i class="ti ti-plus" aria-hidden="true"></i>Ajouter tâche</button>
      </div>

    </div>

</section>
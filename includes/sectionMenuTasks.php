<section class="header-disposition-bottom tasks-list">

    <div class="header-disposition-line">

        <a href="<?= $baseUrl ?>&tab=tasks" class="<?= $tab === 'tasks' ? 'nav-item active-nav' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-list" aria-hidden="true"></i>
                <h4><?= __tphp('liste') ?></h4>
            </div>
        </a>

        <a href="<?= $baseUrl ?>&tab=kanban" class="<?= $tab === 'kanban' ? 'nav-item active-nav' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-layout-kanban" aria-hidden="true"></i>
                <h4><?= __tphp('kanban') ?></h4>
            </div>
        </a>

        <a href="<?= $baseUrl ?>&tab=calendar" class="<?= $tab === 'calendar' ? 'nav-item active-nav' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-calendar-week" aria-hidden="true"></i>
                <h4><?= __tphp('calendar') ?></h4>
            </div>
        </a>

    </div>
    <div class="header-disposition-line tk-list-option">

      <?php if($tab === 'tasks'): ?>
      <div class="nav-item tk-search">
        <i class="ti ti-search" aria-hidden="true"></i>
        <input type="text" placeholder=<?= __tphp('search a task') ?>...>
      </div>

        <div class="nav-item tk-filter-container">
          <button type="button" class="btn-filter-trigger item" onclick="openModal('modal-task-filter')">
            <span></span>
            <i class="ti ti-filter"></i>
            <span><?= __tphp('filters') ?></span>
            <span id="filter-count"></span>
          </button>
        </div>
        <div id="modal-task-filter" class="modal-overlay tk-modify" style="display:none;" onclick="closeModalOverlay(event, 'modal-task-filter')">
          <div class="modal-box modal-filter-box">
            <div class="modal-header">
              <div class="modal-header-meta">
                <h4><i class="ti ti-adjustments-horizontal"></i><?= __tphp('filter and sort tasks') ?></h4>
              </div>
              <button type="button" class="modal-close-btn" onclick="closeModal('modal-task-filter')">
                <i class="ti ti-x"></i>
              </button>
            </div>

            <div class="modal-body filter-grid">

              <div class="modal-section">
                <label class="modal-section-label"><i class="ti ti-sort-ascending font-icon"></i><?= __tphp('alphabetical order') ?></label>
                <select id="filter-sort-title" class="tk-input tk-select">
                  <option value=""><?= __tphp('no sorting') ?></option>
                  <option value="asc"><?= __tphp('A to Z') ?></option>
                  <option value="desc"><?= __tphp('Z to A') ?></option>
                </select>
              </div>

              <div class="modal-section">
                <label class="modal-section-label"><i class="ti ti-loader"></i><?= __tphp('status') ?></label>
                <select id="filter-statut" class="tk-input tk-select">
                  <option value=""><?= __tphp('all statuses') ?></option>
                  <option value="1"><?= __tphp('waiting') ?></option>
                  <option value="2"><?= __tphp('in progress') ?></option>
                  <option value="3"><?= __tphp('in review') ?></option>
                  <option value="4"><?= __tphp('finished') ?></option>
                </select>
              </div>

              <div class="modal-section">
                <label class="modal-section-label"><i class="ti ti-alert-triangle"></i><?= __tphp('priority') ?></label>
                <select id="filter-priorite" class="tk-input tk-select">
                  <option value=""><?= __tphp('all priorities') ?></option>
                  <option value="4"><?= __tphp('critical') ?></option>
                  <option value="3"><?= __tphp('high') ?></option>
                  <option value="2"><?= __tphp('normal') ?></option>
                  <option value="1"><?= __tphp('low') ?></option>
                </select>
              </div>

              <div class="modal-section">
                <label class="modal-section-label"><i class="ti ti-user"></i><?= __tphp('assigned to') ?></label>
                <select id="filter-assignee" class="tk-input tk-select">
                  <option value=""><?= __tphp('all members') ?></option>
                  <?php foreach ($membres as $membre): ?>
                    <!-- La valeur (value) contient l'ID, le texte visible affiche le nom -->
                    <option value="<?= htmlspecialchars($membre['id']) ?>">
                      <?= htmlspecialchars($membre['nom']) ?>
                    </option>
                  <?php endforeach; ?>
                </select>
              </div>

              <div class="modal-section modal-section-full">
                <label class="modal-section-label"><i class="ti ti-calendar-due"></i><?= __tphp('due date') ?></label>
                <div class="filter-date-group">
                  <input type="date" id="filter-date-start" class="tk-input" placeholder=<?= __tphp('from') ?>>
                  <span><?= __tphp('to') ?></span>
                  <input type="date" id="filter-date-end" class="tk-input" placeholder=<?= __tphp('to') ?>>
                </div>
              </div>
            </div>

            <div class="modal-footer tk-footer-actions">
              <button type="button" class="tk-btn-cancel" onclick="resetFilters()"><?= __tphp('reset') ?></button>
              <button type="button" class="tk-btn-save" onclick="applyFilters()"><?= __tphp('apply filters') ?></button>
            </div>
          </div>
        </div>
      <?php endif; ?>

      <?php if($tab === 'calendar'): ?>
        <div class="nav-item">
          <button class="item"><?= __tphp('vertical view') ?></button>
        </div>
      <?php endif; ?>

      <div class="nav-item">
        <button class="item add-tasks"><i class="ti ti-plus" aria-hidden="true"></i><?= __tphp('add task') ?></button>
      </div>

    </div>

</section>
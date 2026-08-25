<section class="header-disposition-bottom">

    <div class="header-disposition-line">

        <a href="<?= $baseUrl ?>&tab=overview" class="tooltip-container <?= $tab === 'overview' ? 'nav-item active-nav ' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-layout" aria-hidden="true"></i>
            </div>
            <span class="tooltip-text navHelp">Aperçu</span>
        </a>

        <a href="<?= $baseUrl ?>&tab=tasks" class="tooltip-container <?= $tab === 'tasks' ? 'nav-item active-nav' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-checkup-list" aria-hidden="true"></i>
            </div>
            <span class="tooltip-text navHelp">Tâches</span>
        </a>

        <a href="<?= $baseUrl ?>&tab=kanban" class="tooltip-container <?= $tab === 'kanban' ? 'nav-item active-nav' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-drag-drop" aria-hidden="true"></i>
            </div>
            <span class="tooltip-text navHelp">Kanban</span>
        </a>

        <a href="<?= $baseUrl ?>&tab=calendar" class="tooltip-container <?= $tab === 'calendar' ? 'nav-item active-nav' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-calendar-event" aria-hidden="true"></i>
            </div>
            <span class="tooltip-text navHelp">Calendrier</span>
        </a>

        <a href="<?= $baseUrl ?>&tab=sprints" class="tooltip-container <?= $tab === 'sprints' ? 'nav-item active-nav' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-run" aria-hidden="true"></i>
            </div>
            <span class="tooltip-text navHelp">Sprints</span>
        </a>

        <a href="<?= $baseUrl ?>&tab=members" class="tooltip-container <?= $tab === 'members' ? 'nav-item active-nav' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-users-group" aria-hidden="true"></i>
            </div>
            <span class="tooltip-text navHelp">Membres</span>
        </a>

        <?php if(Session::isProjectOwner($projectId)): ?>
            <a href="<?= $baseUrl ?>&tab=insights" class="tooltip-container <?= $tab === 'insights' ? 'nav-item active-nav' : 'nav-item' ?>">
                <div class="item">
                    <i class="ti ti-chart-dots-3" aria-hidden="true"></i>
                </div>
                <span class="tooltip-text navHelp">Insights</span>
            </a>
        <?php endif; ?>

    </div>

</section>
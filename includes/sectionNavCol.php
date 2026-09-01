<section class="header-disposition-bottom project-list">

    <div class="header-disposition-line">

        <a href="<?= $baseUrl ?>&tab=overview" class="tooltip-container <?= $tab === 'overview' ? 'nav-item active-nav ' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-layout" aria-hidden="true"></i>
            </div>
            <span class="tooltip-text navHelp"><?= __tphp('overview') ?></span>
        </a>

        <a href="<?= $baseUrl ?>&tab=tasks" class="tooltip-container <?= $tab === 'tasks' ? 'nav-item active-nav' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-checkup-list" aria-hidden="true"></i>
            </div>
            <span class="tooltip-text navHelp"><?= __tphp('tasks') ?></span>
        </a>

        <a href="<?= $baseUrl ?>&tab=sprints" class="tooltip-container <?= $tab === 'sprints' ? 'nav-item active-nav' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-run" aria-hidden="true"></i>
            </div>
            <span class="tooltip-text navHelp"><?= __tphp('sprints') ?></span>
        </a>

        <a href="<?= $baseUrl ?>&tab=members" class="tooltip-container <?= $tab === 'members' ? 'nav-item active-nav' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-users-group" aria-hidden="true"></i>
            </div>
            <span class="tooltip-text navHelp"><?= __tphp('members') ?></span>
        </a>

        <?php if(Session::isProjectOwner($projectId)): ?>
            <a href="<?= $baseUrl ?>&tab=insights" class="tooltip-container <?= $tab === 'insights' ? 'nav-item active-nav' : 'nav-item' ?>">
                <div class="item">
                    <i class="ti ti-chart-dots-3" aria-hidden="true"></i>
                </div>
                <span class="tooltip-text navHelp"><?= __tphp('insights') ?></span>
            </a>
        <?php endif; ?>

    </div>

</section>
<?php
require_once __DIR__.'/../includes/Session.php'
?>
<div class="sidebar-overlay" id="sidebarOverlay"></div>
<header>

    <section class="header-disposition-top">
        <div class="header-disposition-left" style="margin-left: 5px;">
            <div class="menu tooltip-container" id="menuBtn">
                <i class="ti ti-menu-2" aria-hidden="true"></i>
                <span class="tooltip-text menuHelp"><?= __tphp('open menu') ?></span>
            </div>
            <h3><?= __tphp('appName') ?></h3>
        </div>

        <div class="header-disposition-left">
          <div class="menu account-menu tooltip-container searchZone">
            <i class="ti ti-search" aria-hidden="true"></i>
            <input type="text" placeholder=<?= __tphp('search') ?>...>
            <span class="tooltip-text normalHelp"><?= __tphp('search') ?></span>
          </div>
            <div class="menu account-menu tooltip-container" onclick="window.location.href='../pages/project_create.php'">
                <i class="ti ti-plus"></i>
                <span class="tooltip-text normalHelp"><?= __tphp('new project') ?></span>
            </div>
            <?php require_once __DIR__.'/../includes/ongletNavUser.php'?>
        </div>
    </section>
    <?php
    $sansOnglet = ['dashboard', 'myprojects','contributions','mytasks'];
    if (in_array($tab ?? '', $sansOnglet)): ?>
        <?php require_once __DIR__.'/../includes/sectionMenu.php'?>
    <?php endif; ?>

</header>

<aside class="sidebar" id="sidebar">
    <div class="sb-header">
        <span class="sb-title"><?= __tphp('appName') ?></span>
        <button class="sb-close" id="sidebarClose" aria-label=<?= __tphp('close') ?>>
            <i class="ti ti-x" aria-hidden="true"></i>
        </button>
    </div>

    <div class="sb-section">
        <p class="sb-label"><?= __tphp('general') ?></p>
        <a class="sb-item active" href="../app/home.php"><i class="ti ti-smart-home" aria-hidden="true"></i><?= __tphp('home') ?></a>
        <a class="sb-item"><i class="ti ti-bell" aria-hidden="true"></i><?= __tphp('notifications') ?><span class="sb-badge">3</span></a>
        <a class="sb-item"><i class="ti ti-calendar" aria-hidden="true"></i><?= __tphp('calendar') ?></a>
    </div>

    <div class="sb-divider"></div>

    <div class="sb-section">
        <p class="sb-label"><?= __tphp('projects') ?></p>
        <a class="sb-item"><i class="ti ti-folder" aria-hidden="true"></i><?= __tphp('my projects') ?></a>
        <a class="sb-item"><i class="ti ti-users" aria-hidden="true"></i><?= __tphp('contributions') ?></a>
        <a class="sb-item" href="../pages/project_create.php"><i class="ti ti-circle-plus" aria-hidden="true"></i><?= __tphp('new project') ?></a>
    </div>

    <div class="sb-divider"></div>

    <div class="sb-section">
        <p class="sb-label"><?= __tphp('work') ?></p>
        <a class="sb-item"><i class="ti ti-checklist" aria-hidden="true"></i><?= __tphp('my tasks') ?></a>
        <a class="sb-item"><i class="ti ti-clock" aria-hidden="true"></i><?= __tphp('recent') ?></a>
    </div>

    <div class="sb-divider"></div>

    <div class="sb-section">
        <p class="sb-label"><?= __tphp('analysis') ?></p>
        <a class="sb-item"><i class="ti ti-chart-bar" aria-hidden="true"></i><?= __tphp('statistics') ?></a>
        <a class="sb-item"><i class="ti ti-report" aria-hidden="true"></i><?= __tphp('reports') ?></a>
    </div>

    <div class="sb-divider"></div>

    <div class="sb-section">
        <p class="sb-label"><?= __tphp('account') ?></p>
        <a class="sb-item" href="../app/user.php?tab=notifications"><i class="ti ti-settings-2" aria-hidden="true"></i><?= __tphp('settings') ?></a>
      <a class="sb-item" href="../auth/logout.php"><i class="ti ti-logout" aria-hidden="true"></i><?= __tphp('logout') ?></a>
        <a class="sb-item"><i class="ti ti-help" aria-hidden="true"></i><?= __tphp('help') ?></a>
    </div>
</aside>
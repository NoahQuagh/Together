<?php
require_once BASE_PATH.'/includes/Session.php'
?>
<div class="sidebar-overlay" id="sidebarOverlay"></div>
<header>

    <section class="header-disposition-top">
        <div class="header-disposition-left" style="margin-left: 5px;">
            <div class="menu tooltip-container" id="menuBtn">
                <i class="ti ti-menu-2" aria-hidden="true"></i>
                <span class="tooltip-text menuHelp">Ouvrir menu</span>
            </div>
            <h3>Together</h3>
        </div>

        <div class="header-disposition-left">
          <div class="menu account-menu tooltip-container">
            <i class="ti ti-search" aria-hidden="true"></i>
            <span class="tooltip-text normalHelp">Rechercher</span>
          </div>
            <div class="menu account-menu tooltip-container">
                <i class="ti ti-plus"></i>
                <span class="tooltip-text normalHelp">Nouveau projet</span>
            </div>
            <?php require_once BASE_PATH.'/includes/ongletNavUser.php'?>
        </div>
    </section>
    <?php
    $sansOnglet = ['dashboard', 'myprojects','contributions','mytasks'];
    if (in_array($tab ?? '', $sansOnglet)): ?>
        <?php require_once BASE_PATH.'/includes/sectionMenu.php'?>
    <?php endif; ?>

</header>

<aside class="sidebar" id="sidebar">
    <div class="sb-header">
        <span class="sb-title">Together</span>
        <button class="sb-close" id="sidebarClose" aria-label="Fermer">
            <i class="ti ti-x" aria-hidden="true"></i>
        </button>
    </div>

    <div class="sb-section">
        <p class="sb-label">Général</p>
        <a class="sb-item" href="../home/home.php"><i class="ti ti-smart-home" aria-hidden="true"></i>Home</a>
        <a class="sb-item"><i class="ti ti-bell" aria-hidden="true"></i>Notifications<span class="sb-badge">3</span></a>
        <a class="sb-item"><i class="ti ti-message" aria-hidden="true"></i>Messages<span class="sb-dot"></span></a>
        <a class="sb-item"><i class="ti ti-calendar" aria-hidden="true"></i>Calendrier</a>
    </div>

    <div class="sb-divider"></div>

    <div class="sb-section">
        <p class="sb-label">Projets</p>
        <a class="sb-item"><i class="ti ti-folder" aria-hidden="true"></i>Mes projets</a>
        <a class="sb-item"><i class="ti ti-users" aria-hidden="true"></i>Contributions</a>
        <a class="sb-item"><i class="ti ti-circle-plus" aria-hidden="true"></i>Nouveau projet</a>
    </div>

    <div class="sb-divider"></div>

    <div class="sb-section">
        <p class="sb-label">Travail</p>
        <a class="sb-item"><i class="ti ti-checklist" aria-hidden="true"></i>Mes tâches</a>
        <a class="sb-item"><i class="ti ti-clock" aria-hidden="true"></i>Récent</a>
    </div>

    <div class="sb-divider"></div>

    <div class="sb-section">
        <p class="sb-label">Analyse</p>
        <a class="sb-item"><i class="ti ti-chart-bar" aria-hidden="true"></i>Statistiques</a>
        <a class="sb-item"><i class="ti ti-report" aria-hidden="true"></i>Rapports</a>
    </div>

    <div class="sb-divider"></div>

    <div class="sb-section">
        <p class="sb-label">Compte</p>
        <a class="sb-item"><i class="ti ti-settings-2" aria-hidden="true"></i>Paramètres</a>
        <a class="sb-item"><i class="ti ti-help" aria-hidden="true"></i>Aide</a>
    </div>
</aside>
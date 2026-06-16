<?php
require_once 'includes/Session.php'
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
                <i class="ti ti-plus"></i>
                <span class="tooltip-text normalHelp">Nouveau projet</span>
            </div>
            <div class="menu account-menu tooltip-container">
                <i class="ti ti-settings-2" aria-hidden="true"></i>
                <span class="tooltip-text normalHelp">Paramètres</span>
            </div>
            <?php require_once 'includes/ongletNavUser.php'?>
        </div>
    </section>
    <section class="header-disposition-bottom">

        <div class="header-disposition-line">

            <a href="index.php?tab=dashboard" class="<?= $tab === 'dashboard' ? 'nav-item active-nav' : 'nav-item' ?>">
                <div class="item">
                    <i class="ti ti-layout-dashboard" aria-hidden="true"></i>
                    <h4>Dashboard</h4>
                </div>
            </a>

            <a href="index.php?tab=mesProjets" class="<?= $tab === 'mesProjets' ? 'nav-item active-nav' : 'nav-item' ?>">
                <div class="item">
                    <i class="ti ti-folder" aria-hidden="true"></i>
                    <h4>Mes projets</h4>
                </div>
            </a>

            <a href="index.php?tab=contributions" class="<?= $tab === 'contributions' ? 'nav-item active-nav' : 'nav-item' ?>">
                <div class="item">
                    <i class="ti ti-users" aria-hidden="true"></i>
                    <h4>Contributions</h4>
                </div>
            </a>

            <a href="index.php?tab=taches" class="<?= $tab === 'taches' ? 'nav-item active-nav' : 'nav-item' ?>">
                <div class="item">
                    <i class="ti ti-checklist" aria-hidden="true"></i>
                    <h4>Mes tâches</h4>
                </div>
            </a>

        </div>

    </section>

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
        <div class="sb-item active"><i class="ti ti-smart-home" aria-hidden="true"></i>Home</div>
        <div class="sb-item"><i class="ti ti-bell" aria-hidden="true"></i>Notifications<span class="sb-badge">3</span></div>
        <div class="sb-item"><i class="ti ti-message" aria-hidden="true"></i>Messages<span class="sb-dot"></span></div>
        <div class="sb-item"><i class="ti ti-calendar" aria-hidden="true"></i>Calendrier</div>
    </div>

    <div class="sb-divider"></div>

    <div class="sb-section">
        <p class="sb-label">Projets</p>
        <div class="sb-item"><i class="ti ti-folder" aria-hidden="true"></i>Mes projets</div>
        <div class="sb-item"><i class="ti ti-users" aria-hidden="true"></i>Contributions</div>
        <div class="sb-item"><i class="ti ti-circle-plus" aria-hidden="true"></i>Nouveau projet</div>
    </div>

    <div class="sb-divider"></div>

    <div class="sb-section">
        <p class="sb-label">Travail</p>
        <div class="sb-item"><i class="ti ti-checklist" aria-hidden="true"></i>Mes tâches</div>
        <div class="sb-item"><i class="ti ti-clock" aria-hidden="true"></i>Récent</div>
    </div>

    <div class="sb-divider"></div>

    <div class="sb-section">
        <p class="sb-label">Analyse</p>
        <div class="sb-item"><i class="ti ti-chart-bar" aria-hidden="true"></i>Statistiques</div>
        <div class="sb-item"><i class="ti ti-report" aria-hidden="true"></i>Rapports</div>
    </div>

    <div class="sb-divider"></div>

    <div class="sb-section">
        <p class="sb-label">Compte</p>
        <div class="sb-item"><i class="ti ti-settings-2" aria-hidden="true"></i>Paramètres</div>
        <div class="sb-item"><i class="ti ti-help" aria-hidden="true"></i>Aide</div>
    </div>
</aside>
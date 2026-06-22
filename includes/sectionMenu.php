<section class="header-disposition-bottom">

    <div class="header-disposition-line">

        <a href="home.php?tab=dashboard" class="<?= $tab === 'dashboard' ? 'nav-item active-nav' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-layout-dashboard" aria-hidden="true"></i>
                <h4>Dashboard</h4>
            </div>
        </a>

        <a href="home.php?tab=myprojects" class="<?= $tab === 'myprojects' ? 'nav-item active-nav' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-folders" aria-hidden="true"></i>
                <h4>Mes projets</h4>
            </div>
        </a>

        <a href="home.php?tab=contributions" class="<?= $tab === 'contributions' ? 'nav-item active-nav' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-users" aria-hidden="true"></i>
                <h4>Contributions</h4>
            </div>
        </a>

        <a href="home.php?tab=mytasks" class="<?= $tab === 'mytasks' ? 'nav-item active-nav' : 'nav-item' ?>">
            <div class="item">
                <i class="ti ti-checklist" aria-hidden="true"></i>
                <h4>Mes tâches</h4>
            </div>
        </a>

    </div>

</section>

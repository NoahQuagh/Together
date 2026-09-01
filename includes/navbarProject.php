<header>

  <section class="header-disposition-top">
        <div class="header-disposition-left" style="margin-left: 5px;">
            <div class="menu tooltip-container" id="menuBtn" onclick="window.location.href='home.php'">
                <i class="ti ti-chevron-left" aria-hidden="true"></i>
            </div>
            <h3><?= $title ?></h3>
            <?php if(Session::isProjectOwner($projectId)): ?>
            <div class="menu account-menu tooltip-container editZone" onclick="window.location.href='../pages/settings.php'">
                <i class="ti ti-pencil" aria-hidden="true"></i>
            </div>
            <?php endif; ?>
        </div>



        <div class="header-disposition-left">
            <div class="menu account-menu tooltip-container searchZone">
                <i class="ti ti-search" aria-hidden="true"></i>
                <input type="text" placeholder=<?= __tphp('search') ?>...>
                <span class="tooltip-text normalHelp"><?= __tphp('search') ?></span>
            </div>
            <?php require_once __DIR__.'/../includes/ongletNavUser.php'?>
        </div>
    </section>


</header>

<?php
require_once __DIR__ . '/../api/loader/loadUserInfo.php';
?>
<?php if(Session::estConnecte()): ?>

    <a class="menu account-menu tooltip-container" id="account-menu-trigger" href="../settings/user.php?tab=profile">
        <i class="ti ti-user" aria-hidden="true"></i>
        <span class="tooltip-text userHelp">Profile</span>
    </a>

<?php else: ?>

    <div class="menu account-menu tooltip-container" id="account-menu-trigger"
         onclick="window.location.href='../auth/login.php'">
        <i class="ti ti-user" aria-hidden="true"></i>
        <span class="tooltip-text userHelp">Connexion / Inscription</span>
    </div>

<?php endif; ?>

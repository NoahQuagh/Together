<?php
?>
<?php if(Session::estConnecte()): ?>

    <a class="menu account-menu tooltip-container" id="account-menu-trigger" href="../app/user.php?tab=profile">
        <i class="ti ti-user" aria-hidden="true"></i>
        <span class="tooltip-text userHelp"><?= __tphp('profile') ?></span>
    </a>

<?php else: ?>

    <div class="menu account-menu tooltip-container" id="account-menu-trigger"
         onclick="window.location.href='../auth/login.php'">
        <i class="ti ti-user" aria-hidden="true"></i>
        <span class="tooltip-text userHelp"><?= __tphp('login') ?> / <?= __tphp('registration') ?></span>
    </div>

<?php endif; ?>

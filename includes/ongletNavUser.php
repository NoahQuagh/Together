<?php
require_once 'api/loadUserInfo.php';
?>
<?php if(Session::estConnecte()): ?>

    <div class="menu account-menu tooltip-container" id="account-menu-trigger">
        <i class="ti ti-user" aria-hidden="true"></i>
        <span class="tooltip-text userHelp">Ouvrir menu utilisateur</span>

        <div class="gh-dropdown" id="account-dropdown">
            <div class="gh-dropdown-header">
                <div class="gh-user-info">
                    <span class="gh-username"><?= htmlspecialchars($prenom.' '.$nom) ?></span>
                    <span class="gh-pseudo"><?= htmlspecialchars($role) ?></span>
                </div>
            </div>

            <div class="gh-dropdown-divider"></div>

            <a href="#" class="gh-dropdown-item"><i class="ti ti-user"></i> Profile</a>
            <a href="#" class="gh-dropdown-item"><i class="ti ti-folder"></i> Projets</a>

            <div class="gh-dropdown-divider"></div>

            <a href="#" class="gh-dropdown-item"><i class="ti ti-flask"></i> Nouveautés</a>
            <a href="#" class="gh-dropdown-item"><i class="ti ti-palette"></i> Appearance</a>

            <div class="gh-dropdown-divider"></div>

            <a href="auth/logout.php" class="gh-dropdown-item"><i class="ti ti-logout"></i> Déconnexion</a>
        </div>
    </div>

<?php else: ?>

    <div class="menu account-menu tooltip-container" id="account-menu-trigger"
         onclick="window.location.href='auth/login.php'">
        <i class="ti ti-user" aria-hidden="true"></i>
        <span class="tooltip-text userHelp">Connexion / Inscription</span>
    </div>

<?php endif; ?>

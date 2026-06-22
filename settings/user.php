<?php
require_once '../config.php';
require_once BASE_PATH . '/includes/Session.php';
Session::start();
Session::requireLogin();
$tab = $_GET['tab'] ?? 'dashboard';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Together</title>
  <link rel="stylesheet" href="../assets/style/paletteStyle.css">
  <link rel="stylesheet" href="../assets/style/header+sidebar.css">
  <link rel="stylesheet" href="../assets/style/nonConnecterSection.css">
  <link rel="stylesheet" href="../assets/style/footer.css">
  <link rel="stylesheet" href="../assets/style/profile.css">
  <link rel="stylesheet" href="../assets/style/spinnerlogoScaled.css">
  <link rel="stylesheet" href="../assets/style/modal-dialog.css">
  <link rel="stylesheet" href="../assets/style/toast-notification.css">
  <link rel="stylesheet" href="../assets/style/errorloading+iconTop.css">
  <link rel="icon" type="image/png" href="../assets/logo/logoheader.png">
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
        rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
</head>
<body>

<?php require_once BASE_PATH . "/includes/navbar.php" ?>


<main>
  <div class="profile-aside">

    <div class="profile-aside-section">
      <p class="profile-aside-label">Compte</p>
      <a href="user.php?tab=profile" class="<?= $tab === 'profile' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="profil">
        <i class="ti ti-user" aria-hidden="true"></i> Profil
      </a>
      <a href="user.php?tab=security" class="<?= $tab === 'security' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="securite">
        <i class="ti ti-lock" aria-hidden="true"></i> Sécurité
      </a>
      <a href="user.php?tab=notifications" class="<?= $tab === 'notifications' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="notifications">
        <i class="ti ti-bell" aria-hidden="true"></i> Notifications
      </a>
    </div>

    <div class="profile-aside-divider"></div>

    <div class="profile-aside-section">
      <p class="profile-aside-label">Préférences</p>
      <a href="user.php?tab=preference" class="<?= $tab === 'preference' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="apparence">
        <i class="ti ti-palette" aria-hidden="true"></i> Préférence
      </a>
      <a href="user.php?tab=language" class="<?= $tab === 'language' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="langue">
        <i class="ti ti-language" aria-hidden="true"></i> Langue &amp; région
      </a>
      <a href="user.php?tab=accessibility" class="<?= $tab === 'accessibility' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="accessibilite">
        <i class="ti ti-accessible" aria-hidden="true"></i> Accessibilité
      </a>
    </div>

    <div class="profile-aside-divider"></div>

    <div class="profile-aside-section">
      <p class="profile-aside-label">Application</p>
      <a href="user.php?tab=new" class="<?= $tab === 'new' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="nouveautes">
        <i class="ti ti-flask" aria-hidden="true"></i> Nouveautés
        <span class="profile-aside-badge">New</span>
      </a>
      <a href="user.php?tab=integrations" class="<?= $tab === 'integrations' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="integrations">
        <i class="ti ti-plug" aria-hidden="true"></i> Intégrations
      </a>
    </div>

    <div class="profile-aside-divider"></div>

    <div class="profile-aside-section">
      <p class="profile-aside-label">Support</p>
      <a href="user.php?tab=help" class="<?= $tab === 'help' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="aide">
        <i class="ti ti-help" aria-hidden="true"></i> Aide &amp; documentation
      </a>
      <a href="user.php?tab=about" class="<?= $tab === 'about' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="apropos">
        <i class="ti ti-info-circle" aria-hidden="true"></i> À propos
      </a>
    </div>

  </div>
  <?php if(!Session::estConnecte()){
    require_once BASE_PATH . '/includes/nonConnecterSection.php';
  }else{
    switch($tab) {
      case 'security':     require BASE_PATH . '/settings/security.php'; break;
      case 'notifications':     require BASE_PATH . '/settings/notificationsAcnt.php'; break;
      case 'preference':     require BASE_PATH . '/settings/appearance.php'; break;
      case 'language':     require BASE_PATH . '/settings/language.php'; break;
      case 'accessibility':     require BASE_PATH . '/settings/accessibility.php'; break;
      case 'new':     require BASE_PATH . '/settings/new.php'; break;
      case 'help':     require BASE_PATH . '/settings/help.php'; break;
      case 'about':     require BASE_PATH . '/settings/about.php'; break;
      case 'integrations':     require BASE_PATH . '/settings/integrations.php'; break;
      default:            require BASE_PATH.'/settings/acnt.php'; break;
    }
  } ?>
</main>

<?php require_once BASE_PATH."/includes/footer.php" ?>

<script src="../assets/script/navbar+sidebar.js"></script>
<script src="../assets/script/profile.js"></script>
<script src="../assets/script/toast-notification.js"></script>
<script src="../assets/script/modal-dialog.js"></script>
<div id="toast-container" class="toast-container"></div>
</body>
</html>
<?php
require_once __DIR__ . '/../includes/Session.php';
require_once __DIR__ . '/../config/lang_php.php';
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

<?php require_once __DIR__ . "/../includes/navbar.php" ?>


<main>
  <div class="profile-aside">

    <div class="profile-aside-section">
      <p class="profile-aside-label"><?= __tphp('account') ?></p>
      <a href="user.php?tab=profile" class="<?= $tab === 'profile' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="profil">
        <i class="ti ti-user" aria-hidden="true"></i><?= __tphp('profile') ?>
      </a>
      <a href="user.php?tab=security" class="<?= $tab === 'security' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="securite">
        <i class="ti ti-lock" aria-hidden="true"></i><?= __tphp('security') ?>
      </a>
      <a href="user.php?tab=notifications" class="<?= $tab === 'notifications' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="notifications">
        <i class="ti ti-bell" aria-hidden="true"></i><?= __tphp('notifications') ?>
      </a>
    </div>

    <div class="profile-aside-divider"></div>

    <div class="profile-aside-section">
      <p class="profile-aside-label"><?= __tphp('preferences') ?></p>
      <a href="user.php?tab=preference" class="<?= $tab === 'preference' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="apparence">
        <i class="ti ti-adjustments" aria-hidden="true"></i><?= __tphp('preferences') ?>
      </a>
      <a href="user.php?tab=language" class="<?= $tab === 'language' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="langue">
        <i class="ti ti-language" aria-hidden="true"></i><?= __tphp('language') ?>
      </a>
      <a href="user.php?tab=accessibility" class="<?= $tab === 'accessibility' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="accessibilite">
        <i class="ti ti-accessible" aria-hidden="true"></i><?= __tphp('accessibility') ?>
      </a>
    </div>

    <div class="profile-aside-divider"></div>

    <div class="profile-aside-section">
      <p class="profile-aside-label"><?= __tphp('application') ?></p>
      <a href="user.php?tab=new" class="<?= $tab === 'new' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="nouveautes">
        <i class="ti ti-flask" aria-hidden="true"></i><?= __tphp('new features') ?>
      </a>
      <a href="user.php?tab=integrations" class="<?= $tab === 'integrations' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="integrations">
        <i class="ti ti-plug" aria-hidden="true"></i><?= __tphp('integrations') ?>
      </a>
    </div>

    <div class="profile-aside-divider"></div>

    <div class="profile-aside-section">
      <p class="profile-aside-label"><?= __tphp('support') ?></p>
      <a href="user.php?tab=help" class="<?= $tab === 'help' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="aide">
        <i class="ti ti-help" aria-hidden="true"></i><?= __tphp('help & documentation') ?>
      </a>
      <a href="user.php?tab=about" class="<?= $tab === 'about' ? 'profile-aside-item active' : 'profile-aside-item' ?>" data-tab="apropos">
        <i class="ti ti-info-circle" aria-hidden="true"></i><?= __tphp('about') ?>
      </a>
    </div>

  </div>
  <?php if(!Session::estConnecte()){
    require_once __DIR__ . '/../includes/nonConnecterSection.php';
  }else{
    switch($tab) {
      case 'security':     require '../settings/security.php'; break;
      case 'notifications':     require '../settings/notificationsAcnt.php'; break;
      case 'preference':     require '../settings/appearance.php'; break;
      case 'language':     require '../settings/language.php'; break;
      case 'accessibility':     require '../settings/accessibility.php'; break;
      case 'new':     require '../settings/new.php'; break;
      case 'help':     require '../settings/help.php'; break;
      case 'about':     require '../settings/about.php'; break;
      case 'integrations':     require '../settings/integrations.php'; break;
      default:            require '../settings/acnt.php'; break;
    }
  } ?>
</main>

<?php require_once __DIR__ . "/../includes/footer.php" ?>

<script src="../assets/script/navbar+sidebar.js"></script>
<script src="../assets/script/profile.js"></script>
<script src="../assets/script/toast-notification.js"></script>
<script src="../assets/script/modal-dialog.js"></script>
<script src="../config/lang_js.php"></script>
<div id="toast-container" class="toast-container"></div>
</body>
</html>
<?php
require_once '../config.php';
require_once BASE_PATH . '/includes/Session.php';
Session::start();
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
  <link rel="stylesheet" href="../assets/style/user.css">
  <link rel="stylesheet" href="../assets/style/profile.css">
  <link rel="stylesheet" href="../assets/style/spinnerlogoScaled.css">
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
      <a href="profile.php?tab=profil" class="profile-aside-item active" data-tab="profil">
        <i class="ti ti-user" aria-hidden="true"></i> Profil
      </a>
      <a href="profile.php?tab=securite" class="profile-aside-item" data-tab="securite">
        <i class="ti ti-lock" aria-hidden="true"></i> Sécurité
      </a>
      <a href="profile.php?tab=notifications" class="profile-aside-item" data-tab="notifications">
        <i class="ti ti-bell" aria-hidden="true"></i> Notifications
      </a>
    </div>

    <div class="profile-aside-divider"></div>

    <div class="profile-aside-section">
      <p class="profile-aside-label">Préférences</p>
      <a href="profile.php?tab=apparence" class="profile-aside-item" data-tab="apparence">
        <i class="ti ti-palette" aria-hidden="true"></i> Apparence
      </a>
      <a href="profile.php?tab=langue" class="profile-aside-item" data-tab="langue">
        <i class="ti ti-language" aria-hidden="true"></i> Langue &amp; région
      </a>
      <a href="profile.php?tab=accessibilite" class="profile-aside-item" data-tab="accessibilite">
        <i class="ti ti-accessible" aria-hidden="true"></i> Accessibilité
      </a>
    </div>

    <div class="profile-aside-divider"></div>

    <div class="profile-aside-section">
      <p class="profile-aside-label">Application</p>
      <a href="profile.php?tab=nouveautes" class="profile-aside-item" data-tab="nouveautes">
        <i class="ti ti-flask" aria-hidden="true"></i> Nouveautés
        <span class="profile-aside-badge">New</span>
      </a>
      <a href="profile.php?tab=integrations" class="profile-aside-item" data-tab="integrations">
        <i class="ti ti-plug" aria-hidden="true"></i> Intégrations
      </a>
      <a href="profile.php?tab=facturation" class="profile-aside-item" data-tab="facturation">
        <i class="ti ti-credit-card" aria-hidden="true"></i> Facturation
      </a>
    </div>

    <div class="profile-aside-divider"></div>

    <div class="profile-aside-section">
      <p class="profile-aside-label">Support</p>
      <a href="profile.php?tab=aide" class="profile-aside-item" data-tab="aide">
        <i class="ti ti-help" aria-hidden="true"></i> Aide &amp; documentation
      </a>
      <a href="profile.php?tab=apropos" class="profile-aside-item" data-tab="apropos">
        <i class="ti ti-info-circle" aria-hidden="true"></i> À propos
      </a>
    </div>

  </div>
  <?php if(!Session::estConnecte()){
    require_once BASE_PATH . '/includes/nonConnecterSection.php';
  }else{
    switch($tab) {
      case 'settings':     require BASE_PATH . '/api/loadProfile.php'; break;
      default:            require BASE_PATH.'/api/loadProfile.php'; break;
    }
  } ?>
</main>

<?php require_once BASE_PATH."/includes/footer.php" ?>

<script src="../assets/script/navbar+sidebar.js"></script>
</body>
</html>
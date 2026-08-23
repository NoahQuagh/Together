<?php
require_once __DIR__ . '/../includes/Session.php';
Session::start();
Session::requireLogin();
$projectId = $_GET['key'] ?? null;

if (!$projectId) {
    header('Location: /home/home.php');
    exit;
}

require_once __DIR__ . '/../api/loader/loadProjectTitle.php'

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title><?= $title ?> - Together</title>
    <link rel="stylesheet" href="../assets/style/paletteStyle.css">
    <link rel="stylesheet" href="../assets/style/header+sidebar.css">
    <link rel="stylesheet" href="../assets/style/nonConnecterSection.css">
    <link rel="stylesheet" href="../assets/style/footer.css">
    <link rel="stylesheet" href="../assets/style/spinnerlogoScaled.css">
    <link rel="stylesheet" href="../assets/style/errorloading+iconTop.css">
    <link rel="stylesheet" href="../assets/style/toast-notification.css">
    <link rel="stylesheet" href="../assets/style/modal-dialog.css">
    <link rel="stylesheet" href="../assets/style/projectApp.css">
    <link rel="icon" type="image/png" href="../assets/logo/logoheader.png">
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
          rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
</head>
<body>

<?php require_once __DIR__ . "/../includes/navbarProject.php" ?>

<main id="main-zone">
  <div class="demo-item">
    <div class="tog-spinner">
      <div class="tog-bg"></div>
      <div class="tog-elements">
        <div class="tog-top">
          <div class="tog-bar-long"></div>
          <div class="tog-bar-short"></div>
        </div>
        <div class="tog-bottom">
          <div class="tog-block"></div>
          <div class="tog-block"></div>
        </div>
      </div>
    </div>
    <div class="tog-dots">
      <div class="tog-dot"></div>
      <div class="tog-dot"></div>
      <div class="tog-dot"></div>
    </div>
    <span class="demo-caption" id="wait">Nous recherchons où vous avez été le plus productif… les pauses café ne comptent pas, bien sûr.</span>
  </div>
</main>

<script src="../assets/script/navbarProject.js"></script>
<script src="../assets/script/toast-notification.js"></script>
<script src="../assets/script/modal-dialog.js"></script>
<script src="../assets/script/renderers/projectRenderer.js"></script>
<div id="toast-container" class="toast-container"></div><!--zone de notif-->
</body>
</html>

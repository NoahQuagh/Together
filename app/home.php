<?php
require_once __DIR__  . '/../includes/Session.php';
Session::start();
Session::requireLogin();
require_once __DIR__  . '/../config/lang_php.php';
$tab = $_GET['tab'] ?? 'dashboard';
require_once __DIR__  . '/../includes/defineTheme.php';
?>
<!DOCTYPE html>
<html lang="fr" data-theme="<?= $themeAttr ?>">
<head>
  <meta charset="UTF-8">
  <title>Home - Together</title>
  <link rel="stylesheet" href="../assets/style/paletteStyle.css">
  <link rel="stylesheet" href="../assets/style/home/home.css">
  <link rel="stylesheet" href="../assets/style/tools/loader.css">
  <link rel="stylesheet" href="../assets/style/navigation/header+sidebar.css">
  <link rel="stylesheet" href="../assets/style/tools/nonConnecterSection.css">
  <link rel="stylesheet" href="../assets/style/home/dashBoard.css">
  <link rel="stylesheet" href="../assets/style/home/myTasks.css">
  <link rel="stylesheet" href="../assets/style/navigation/footer.css">
  <link rel="stylesheet" href="../assets/style/tools/spinnerlogoScaled.css">
  <link rel="stylesheet" href="../assets/style/tools/errorloading+iconTop.css">
  <link rel="stylesheet" href="../assets/style/home/myproject.css">
  <link rel="stylesheet" href="../assets/style/tools/toast-notification.css">
  <link rel="stylesheet" href="../assets/style/tools/modal-dialog.css">
  <link rel="stylesheet" href="../assets/style/tools/zone-travaux.css">
  <link rel="icon" type="image/png" href="../assets/logo/logoheader.png">
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
        rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
</head>
<body>

<?php require_once __DIR__ . "/../includes/navbar.php" ?>

<main>
  <?php if(!Session::estConnecte()){
     require_once __DIR__ . '/../includes/nonConnecterSection.php';
   }else{
    switch($tab) {
        case 'myprojects':     require '../pages/mesProjet.php'; break;
        case 'contributions': require '../pages/contributions.php'; break;
        case 'mytasks':      require '../pages/mesTaches.php'; break;
        default:            require '../pages/dashboard.php'; break;
    }
  } ?>
</main>

<?php require_once __DIR__."/../includes/footer.php" ?>
<script>
    window.translations = <?= json_encode($translations ?? [], JSON_UNESCAPED_UNICODE); ?>;

    window.__t = function(key) {
        if (window.translations && window.translations[key]) {
            return window.translations[key];
        }
        return key;
    };
</script>
<script src="../assets/script/navigation/navbar+sidebar.js"></script>
<script src="../assets/script/myproject.js"></script>
<script src="../assets/script/tools/toast-notification.js"></script>
<script src="../assets/script/tools/modal-dialog.js"></script>
<script src="../assets/script/tools/theme.js"></script>
<script src="../assets/script/renderers/home/dashboardRenderer.js"></script>
<script src="../assets/script/renderers/home/myprojectRenderer.js"></script>
<script src="../assets/script/renderers/home/contributionRenderer.js"></script>
<script src="../assets/script/renderers/home/myTasksRenderer.js"></script>
<script src="../assets/script/tools/toolbox.js"></script>
<div id="toast-container" class="toast-container"></div><!--zone notif-->
</body>
</html>
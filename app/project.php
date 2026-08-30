<?php
require_once __DIR__ . '/../includes/Session.php';
Session::start();
Session::requireLogin();
$projectId = $_GET['key'] ?? null;
$tab = $_GET['tab'] ?? 'overview';
$baseUrl = 'project.php?key=' . htmlspecialchars($projectId);

if (!$projectId) {
    header('Location: home.php');
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
    <link rel="stylesheet" href="../assets/style/footer.css">
    <link rel="stylesheet" href="../assets/style/spinnerlogoScaled.css">
    <link rel="stylesheet" href="../assets/style/errorloading+iconTop.css">
    <link rel="stylesheet" href="../assets/style/toast-notification.css">
    <link rel="stylesheet" href="../assets/style/modal-dialog.css">
    <link rel="stylesheet" href="../assets/style/projectApp.css">
    <link rel="stylesheet" href="../assets/style/navSectionCol.css">
    <link rel="icon" type="image/png" href="../assets/logo/logoheader.png">
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
          rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
</head>
<body>

<?php require_once __DIR__ . "/../includes/navbarProject.php" ?>

<main id="main-bg">
  <?php require_once __DIR__ . "/../includes/sectionNavCol.php" ?>
  <section id="main-zone">
    <?php if(!Session::estConnecte()){
      require_once __DIR__ . '/../includes/nonConnecterSection.php';
    }else{
      switch($tab) {
        case 'overview':     require '../project/overview.php'; break;
        case 'tasks': require '../project/tasks.php'; break;
        case 'kanban':      require '../project/kanban.php'; break;
        case 'calendar':      require '../project/calendar.php'; break;
        case 'sprints':      require '../project/sprints.php'; break;
        case 'members':      require '../project/members.php'; break;
        case 'insights':      require '../project/insights.php'; break;
        default:            require '../project/overview.php'; break;
      }
    } ?>
  </section>
</main>

<?php require_once __DIR__ . '/../includes/footer.php' ?>

<script src="../assets/script/navbarProject.js"></script>
<script src="../assets/script/toast-notification.js"></script>
<script src="../assets/script/modal-dialog.js"></script>
<script src="../assets/script/renderers/projectRenderer.js"></script>
<div id="toast-container" class="toast-container"></div><!--zone de notif-->
</body>
</html>

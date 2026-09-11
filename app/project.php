<?php
require_once __DIR__ . '/../includes/Session.php';

Session::start();
Session::requireLogin();
require_once __DIR__  . '/../config/lang_php.php';
$projectId = $_GET['key'] ?? null;
$tab = $_GET['tab'] ?? 'overview';
$baseUrl = 'project.php?key=' . htmlspecialchars($projectId);

if (!$projectId) {
    header('Location: home.php');
    exit;
}

require_once __DIR__ . '/../api/loader/loadProjectTitle.php';
require_once __DIR__  . '/../includes/defineTheme.php';
?>
<!DOCTYPE html>
<html lang="fr" data-theme="<?= $themeAttr ?>">
<head>
    <meta charset="UTF-8">
    <title><?= $title ?> - Together</title>
    <link rel="stylesheet" href="../assets/style/paletteStyle.css">
    <link rel="stylesheet" href="../assets/style/navigation/header+sidebar.css">
    <link rel="stylesheet" href="../assets/style/navigation/footer.css">
  <link rel="stylesheet" href="../assets/style/tools/loader.css">
    <link rel="stylesheet" href="../assets/style/tools/spinnerlogoScaled.css">
    <link rel="stylesheet" href="../assets/style/tools/errorloading+iconTop.css">
    <link rel="stylesheet" href="../assets/style/tools/toast-notification.css">
    <link rel="stylesheet" href="../assets/style/tools/modal-dialog.css">
    <link rel="stylesheet" href="../assets/style/project/navSectionCol.css">
    <link rel="stylesheet" href="../assets/style/project/projectApp.css">
    <link rel="stylesheet" href="../assets/style/project/projectTasksList.css">
    <link rel="stylesheet" href="../assets/style/project/projectTasksCalendar.css">
  <link rel="stylesheet" href="../assets/style/tools/zone-travaux.css">
    <link rel="icon" type="image/png" href="../assets/logo/logoheader.png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/frappe-gantt/1.2.2/frappe-gantt.min.css">
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
        case 'overview':     require '../pages/overview.php'; break;
        case 'tasks': require '../pages/tasks.php'; break;
        case 'kanban':      require '../pages/kanban.php'; break;
        case 'calendar':      require '../pages/calendar.php'; break;
        case 'sprints':      require '../pages/sprints.php'; break;
        case 'members':      require '../pages/members.php'; break;
        case 'insights':      require '../pages/insights.php'; break;
        default:            require '../pages/overview.php'; break;
      }
    } ?>
  </section>
</main>

<?php require_once __DIR__ . '/../includes/footer.php' ?>

<script>
    window.translations = <?= json_encode($translations ?? [], JSON_UNESCAPED_UNICODE); ?>;

    window.__t = function(key) {
        if (window.translations && window.translations[key]) {
            return window.translations[key];
        }
        return key;
    };
</script>
<script src="../assets/script/navigation/navbarProject.js"></script>
<script src="../assets/script/tools/toast-notification.js"></script>
<script src="../assets/script/tools/modal-dialog.js"></script>
<script src="../assets/script/renderers/project/calendarProjectRenderer.js"></script>
<script src="../assets/script/renderers/project/projectRenderer.js"></script>
<script src="../assets/script/tools/theme.js"></script>
<script src="../assets/script/tools/toolbox.js"></script>
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/frappe-gantt/1.2.2/frappe-gantt.umd.js"></script>
<div id="toast-container" class="toast-container"></div><!--zone de notif-->
</body>
</html>

<?php
require_once 'includes/Session.php';
Session::start();
$tab = $_GET['tab'] ?? 'dashboard';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Together</title>
  <link rel="stylesheet" href="assets/style/paletteStyle.css">
  <link rel="stylesheet" href="assets/style/index.css">
  <link rel="stylesheet" href="assets/style/header+sidebar.css">
  <link rel="stylesheet" href="assets/style/nonConnecterSection.css">
  <link rel="stylesheet" href="assets/style/dashBoard.css">
  <link rel="stylesheet" href="assets/style/footer.css">
  <link rel="stylesheet" href="assets/style/spinnerlogoScaled.css">
  <link rel="stylesheet" href="assets/style/errorloading+iconTop.css">
  <link rel="icon" type="image/png" href="assets/logo/logoheader.png">
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
        rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
</head>
<body>

<?php require_once "includes/navbar.php" ?>

<main>
  <?php if(!Session::estConnecte()){
     require_once 'includes/nonConnecterSection.php';
   }else{
    switch($tab) {
        case 'mesProjets':     require 'sections/mesProjet.php'; break;
        case 'contributions': require 'sections/contributions.php'; break;
        case 'taches':      require 'sections/taches.php'; break;
        default:            require 'sections/dashboard.php'; break;
    }
  } ?>
</main>

<?php require_once "includes/footer.php" ?>

<script src="assets/script/index.js"></script>
<script src="assets/script/navbar+sidebar.js"></script>
</body>
</html>
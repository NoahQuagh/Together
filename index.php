<?php
require_once 'includes/Session.php';
Session::start();
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
  <link rel="stylesheet" href="assets/style/footer.css">
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
        rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
</head>
<body>

<?php require_once "includes/navbar.php" ?>

<main>
  <?php if(!Session::estConnecte()){ ?>
    <?php require_once 'includes/nonConnecterSection.php'; ?>
  <?php } else { ?>
    <h3>connecté</h3>
  <?php } ?>
</main>

<?php require_once "includes/footer.php" ?>

<script src="assets/script/index.js"></script>
</body>
</html>
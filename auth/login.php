<?php
require_once __DIR__ . '/../includes/Session.php';
require_once __DIR__ . '/../config/lang_php.php';


if (Session::estConnecte()) {
  header('Location: ../app/home.php');
  exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Login - Together</title>
  <link rel="stylesheet" href="../assets/style/paletteStyle.css">
  <link rel="stylesheet" href="../assets/style/navigation/footer.css">
  <link rel="stylesheet" href="../assets/style/login.css">
  <link rel="stylesheet" href="../assets/style/tools/logo.css">
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
        rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
  <link rel="stylesheet" href="../assets/dist/login-avatar.css">


</head>
<body>

<div class="back-button">
  <button onclick="window.history.back()"><i class="ti ti-arrow-left"></i><?= __tphp('back') ?></button>
</div>


<main class="auth-page">
  <aside class="auth-side">
    <div class="auth-side-inner">

      <div id="blobatar-root"></div>

      <div class="logo-complete">
        <div class="line">
          <div class="demo-item">
            <div class="tog-spinner large">
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
          </div>
          <div class="auth-side-copy">
            <h2><?= __tphp('appName') ?></h2>
            <p class="signature"><?= __tphp('slogan1') ?>.</p>
          </div>
        </div>
      </div>


      <ul class="auth-side-features">
        <li>
          <span class="feat-dot feat-dot--blue"></span>
          <?= __tphp('features1') ?>
        </li>
        <li>
          <span class="feat-dot feat-dot--green"></span>
          <?= __tphp('features2') ?>
        </li>
        <li>
          <span class="feat-dot feat-dot--yellow"></span>
          <?= __tphp('features3') ?>
        </li>
      </ul>

      <div class="auth-side-badge">
        <?= __tphp('version') ?>
      </div>

    </div>
  </aside>
  <section class="auth-panel">

    <div class="auth-stage" id="authStage" data-active="login">

      <div class="auth-form-wrap" id="fLogin" data-form="login">

        <div class="auth-form-head">
          <p class="auth-eyebrow"><?= __tphp('login') ?></p>
          <h1><?= __tphp('welcome back') ?></h1>
        </div>

        <?php if (Session::hasFlash('erreur')): ?>
          <div class="auth-alert auth-alert--error">
            <i class="ti ti-alert-circle" aria-hidden="true"></i>
            <?= htmlspecialchars(Session::getFlash('erreur')) ?>
          </div>
        <?php endif; ?>
        <?php if (Session::hasFlash('succes')): ?>
          <div class="auth-alert auth-alert--success">
            <i class="ti ti-circle-check" aria-hidden="true"></i>
            <?= htmlspecialchars(Session::getFlash('succes')) ?>
          </div>
        <?php endif; ?>

        <form class="auth-form" method="POST" action="../api/auth/loginUser.php">

          <div class="auth-field">
            <label for="login-email"><?= __tphp('e-mail') ?></label>
            <div class="auth-input-wrap">
              <i class="ti ti-mail" aria-hidden="true"></i>
              <input type="email" id="login-email" name="email"
                     placeholder="together@example.com"
                     autocomplete="email" required>
            </div>
          </div>

          <div class="auth-field">
            <div class="auth-field-head">
              <label for="login-mdp"><?= __tphp('password') ?></label>
              <a href="reset.php" class="auth-link-xs"><?= __tphp('forget') ?> ?</a>
            </div>
            <div class="auth-input-wrap">
              <i class="ti ti-lock" aria-hidden="true"></i>
              <input type="password" id="login-mdp" name="mot_de_passe"
                     placeholder="••••••••"
                     autocomplete="current-password" required>
              <button type="button" class="auth-eye"
                      onclick="togglePwd('login-mdp',this)"
                      aria-label=<?= __tphp('show password') ?>>
                <i class="ti ti-eye"></i>
              </button>
            </div>
          </div>

          <label class="auth-checkbox"><!--TODO revoir pour souvenir du mdp-->
            <input type="checkbox" name="souvenir">
            <span class="check-box"></span>
            <?= __tphp('remember me') ?>
          </label>

          <button type="submit" class="auth-btn-submit">
            <span><?= __tphp('login') ?></span>
            <i class="ti ti-arrow-right" aria-hidden="true"></i>
          </button>

        </form>

        <div class="auth-switch-row">
          <span><?= __tphp('no account') ?> ?</span>
          <button class="auth-switch-btn" data-target="register" onclick="window.location.href='signIn.php'">
            <?= __tphp('create an account') ?>
            <i class="ti ti-chevron-right" aria-hidden="true"></i>
          </button>
        </div>

      </div>

    </div>

  </section>

</main>

<script type="module" src="../assets/dist/login-avatar.js"></script>
<script src="../assets/script/login.js"></script>
<script src="../config/lang_js.php"></script>
<script>
    window.__authInit = '<?= Session::hasFlash('erreur_register') ? 'register' : 'login' ?>';
</script>
</body>
</html>

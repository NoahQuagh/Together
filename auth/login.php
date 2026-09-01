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
  <link rel="stylesheet" href="../assets/style/footer.css">
  <link rel="stylesheet" href="../assets/style/login.css">
  <link rel="stylesheet" href="../assets/style/logo.css">
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
        rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
</head>
<body>

<div class="back-button">
  <button onclick="window.history.back()"><i class="ti ti-arrow-left"></i><?= __tphp('back') ?></button>
</div>

<div class="auth-grid-bg" aria-hidden="true">
  <div class="grid-lines"></div>
  <div class="grid-pulse" id="gridPulse"></div>
</div>

<main class="auth-page">
  <aside class="auth-side">
    <div class="auth-side-inner">

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
            <div class="tog-dots">
              <div class="tog-dot"></div>
              <div class="tog-dot"></div>
              <div class="tog-dot"></div>
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

        <form class="auth-form" method="POST" action="loginUser.php">

          <div class="auth-field">
            <label for="login-email"><?= __tphp('e-mail') ?></label>
            <div class="auth-input-wrap">
              <i class="ti ti-mail" aria-hidden="true"></i>
              <input type="email" id="login-email" name="email"
                     placeholder="vous@example.com"
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

          <label class="auth-checkbox">
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
          <button class="auth-switch-btn" data-target="register">
            <?= __tphp('create an account') ?>
            <i class="ti ti-chevron-right" aria-hidden="true"></i>
          </button>
        </div>

      </div>


      <div class="auth-form-wrap auth-form-wrap--off" id="fRegister" data-form="register">

        <div class="auth-form-head">
          <p class="auth-eyebrow"><?= __tphp('registration') ?></p>
          <h1><?= __tphp('join Together') ?></h1>
        </div>

        <?php if (Session::hasFlash('erreur_register')): ?>
          <div class="auth-alert auth-alert--error">
            <i class="ti ti-alert-circle" aria-hidden="true"></i>
            <?= htmlspecialchars(Session::getFlash('erreur_register')) ?>
          </div>
        <?php endif; ?>

        <form class="auth-form" method="POST" action="SignIn.php" novalidate>

          <div class="auth-row-2">
            <div class="auth-field">
              <label for="reg-prenom"><?= __tphp('first name') ?></label>
              <div class="auth-input-wrap">
                <i class="ti ti-user" aria-hidden="true"></i>
                <input type="text" id="reg-prenom" name="prenom"
                       placeholder="Jean"
                       autocomplete="given-name" required>
              </div>
            </div>
            <div class="auth-field">
              <label for="reg-nom"><?= __tphp('name') ?></label>
              <div class="auth-input-wrap">
                <input type="text" id="reg-nom" name="nom"
                       placeholder="Dupont"
                       autocomplete="family-name" required>
              </div>
            </div>
          </div>

          <div class="auth-field">
            <label for="reg-email"><?= __tphp('e-mail') ?></label>
            <div class="auth-input-wrap">
              <i class="ti ti-mail" aria-hidden="true"></i>
              <input type="email" id="reg-email" name="email"
                     placeholder="name@example.com"
                     autocomplete="email" required>
            </div>
          </div>

          <div class="auth-field">
            <label for="reg-mdp"><?= __tphp('password') ?></label>
            <div class="auth-input-wrap">
              <i class="ti ti-lock" aria-hidden="true"></i>
              <input type="password" id="reg-mdp" name="mot_de_passe"
                     placeholder="8 caractères minimum"
                     autocomplete="new-password" required minlength="8"
                     oninput="updateStrength(this.value)">
              <button type="button" class="auth-eye"
                      onclick="togglePwd('reg-mdp',this)"
                      aria-label=<?= __tphp('show password') ?>>
                <i class="ti ti-eye"></i>
              </button>
            </div>
            <div class="str-track">
              <div class="str-bar" id="strBar"></div>
            </div>
            <span class="str-label" id="strLabel"></span>
          </div>

          <div class="auth-field">
            <label for="reg-mdp2"><?= __tphp('confirm') ?></label>
            <div class="auth-input-wrap">
              <i class="ti ti-lock-check" aria-hidden="true"></i>
              <input type="password" id="reg-mdp2" name="mot_de_passe_confirm"
                     placeholder="••••••••"
                     autocomplete="new-password" required>
            </div>
          </div>

          <label class="auth-checkbox">
            <input type="checkbox" name="cgu" required>
            <span class="check-box"></span>
            <?= __tphp('i accept the') ?> <a href="../legal/cgu.php" class="auth-link-inline">CGU</a>
          </label>

          <button type="submit" class="auth-btn-submit">
            <span><?= __tphp('create my account') ?></span>
            <i class="ti ti-arrow-right" aria-hidden="true"></i>
          </button>

        </form>

        <div class="auth-switch-row">
          <span><?= __tphp('already registered') ?> ?</span>
          <button class="auth-switch-btn" data-target="login">
            <?= __tphp('login') ?>
            <i class="ti ti-chevron-right" aria-hidden="true"></i>
          </button>
        </div>

      </div>

    </div>

  </section>

</main>

<script src="../assets/script/login.js"></script>
<script src="../config/lang_js.php"></script>
<script>
    window.__authInit = '<?= Session::hasFlash('erreur_register') ? 'register' : 'login' ?>';
</script>
</body>
</html>

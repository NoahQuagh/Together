<?php
require_once "includes/Session.php";

if (Session::estConnecte()) {
  header('Location: /together/index.php');
  exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Together</title>
  <link rel="stylesheet" href="assets/style/paletteStyle.css">
  <link rel="stylesheet" href="assets/style/footer.css">
  <link rel="stylesheet" href="assets/style/login.css">
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
        rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
</head>
<body>

<div class="back-button">
  <button onclick="window.history.back()"><i class="ti ti-arrow-left"></i>Retour</button>
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
          <div class="auth-logo-mark">
            <i class="ti ti-layout-kanban" aria-hidden="true"></i>
          </div>
          <div class="auth-side-copy">
            <h2>Together</h2>
          </div>
        </div>

        <p class="signature">Organisez, collaborez,<br>livrez — ensemble.</p>
      </div>


      <ul class="auth-side-features">
        <li>
          <span class="feat-dot feat-dot--blue"></span>
          Kanban, sprints &amp; roadmap
        </li>
        <li>
          <span class="feat-dot feat-dot--green"></span>
          Collaboration en temps réel
        </li>
        <li>
          <span class="feat-dot feat-dot--yellow"></span>
          Rapports &amp; statistiques
        </li>
      </ul>

      <div class="auth-side-badge">
        <span class="badge-dot"></span>
        v1.0 — bêta privée
      </div>

    </div>
  </aside>
  <section class="auth-panel">

    <div class="auth-stage" id="authStage" data-active="login">

      <div class="auth-form-wrap" id="fLogin" data-form="login">

        <div class="auth-form-head">
          <p class="auth-eyebrow">Connexion</p>
          <h1>Bon retour</h1>
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

        <form class="auth-form" method="POST" action="auth/loginUser.php">

          <div class="auth-field">
            <label for="login-email">E-mail</label>
            <div class="auth-input-wrap">
              <i class="ti ti-mail" aria-hidden="true"></i>
              <input type="email" id="login-email" name="email"
                     placeholder="vous@example.com"
                     autocomplete="email" required>
            </div>
          </div>

          <div class="auth-field">
            <div class="auth-field-head">
              <label for="login-mdp">Mot de passe</label>
              <a href="/together/auth/reset.php" class="auth-link-xs">Oublié ?</a>
            </div>
            <div class="auth-input-wrap">
              <i class="ti ti-lock" aria-hidden="true"></i>
              <input type="password" id="login-mdp" name="mot_de_passe"
                     placeholder="••••••••"
                     autocomplete="current-password" required>
              <button type="button" class="auth-eye"
                      onclick="togglePwd('login-mdp',this)"
                      aria-label="Afficher le mot de passe">
                <i class="ti ti-eye"></i>
              </button>
            </div>
          </div>

          <label class="auth-checkbox">
            <input type="checkbox" name="souvenir">
            <span class="check-box"></span>
            Se souvenir de moi
          </label>

          <button type="submit" class="auth-btn-submit">
            <span>Se connecter</span>
            <i class="ti ti-arrow-right" aria-hidden="true"></i>
          </button>

        </form>

        <div class="auth-switch-row">
          <span>Pas de compte ?</span>
          <button class="auth-switch-btn" data-target="register">
            Créer un compte
            <i class="ti ti-chevron-right" aria-hidden="true"></i>
          </button>
        </div>

      </div>


      <div class="auth-form-wrap auth-form-wrap--off" id="fRegister" data-form="register">

        <div class="auth-form-head">
          <p class="auth-eyebrow">Inscription</p>
          <h1>Rejoindre Together</h1>
        </div>

        <?php if (Session::hasFlash('erreur_register')): ?>
          <div class="auth-alert auth-alert--error">
            <i class="ti ti-alert-circle" aria-hidden="true"></i>
            <?= htmlspecialchars(Session::getFlash('erreur_register')) ?>
          </div>
        <?php endif; ?>

        <form class="auth-form" method="POST" action="auth/SignIn.php" novalidate>

          <div class="auth-row-2">
            <div class="auth-field">
              <label for="reg-prenom">Prénom</label>
              <div class="auth-input-wrap">
                <i class="ti ti-user" aria-hidden="true"></i>
                <input type="text" id="reg-prenom" name="prenom"
                       placeholder="Jean"
                       autocomplete="given-name" required>
              </div>
            </div>
            <div class="auth-field">
              <label for="reg-nom">Nom</label>
              <div class="auth-input-wrap">
                <input type="text" id="reg-nom" name="nom"
                       placeholder="Dupont"
                       autocomplete="family-name" required>
              </div>
            </div>
          </div>

          <div class="auth-field">
            <label for="reg-email">E-mail</label>
            <div class="auth-input-wrap">
              <i class="ti ti-mail" aria-hidden="true"></i>
              <input type="email" id="reg-email" name="email"
                     placeholder="vous@example.com"
                     autocomplete="email" required>
            </div>
          </div>

          <div class="auth-field">
            <label for="reg-mdp">Mot de passe</label>
            <div class="auth-input-wrap">
              <i class="ti ti-lock" aria-hidden="true"></i>
              <input type="password" id="reg-mdp" name="mot_de_passe"
                     placeholder="8 caractères minimum"
                     autocomplete="new-password" required minlength="8"
                     oninput="updateStrength(this.value)">
              <button type="button" class="auth-eye"
                      onclick="togglePwd('reg-mdp',this)"
                      aria-label="Afficher le mot de passe">
                <i class="ti ti-eye"></i>
              </button>
            </div>
            <div class="str-track">
              <div class="str-bar" id="strBar"></div>
            </div>
            <span class="str-label" id="strLabel"></span>
          </div>

          <div class="auth-field">
            <label for="reg-mdp2">Confirmer</label>
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
            J'accepte les <a href="/together/cgu.php" class="auth-link-inline">CGU</a>
          </label>

          <button type="submit" class="auth-btn-submit">
            <span>Créer mon compte</span>
            <i class="ti ti-arrow-right" aria-hidden="true"></i>
          </button>

        </form>

        <div class="auth-switch-row">
          <span>Déjà inscrit ?</span>
          <button class="auth-switch-btn" data-target="login">
            Se connecter
            <i class="ti ti-chevron-right" aria-hidden="true"></i>
          </button>
        </div>

      </div>

    </div>

  </section>

</main>

<script src="assets/script/login.js"></script>
<script>
    window.__authInit = '<?= Session::hasFlash('erreur_register') ? 'register' : 'login' ?>';
</script>
</body>
</html>

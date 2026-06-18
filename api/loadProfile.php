<?php

try{
  require_once 'db.php';
  require_once '../includes/Session.php';

  $db = getDB();

  $flash_succes = Session::hasFlash('succes_profil') ? Session::getFlash('succes_profil') : null;
  $flash_erreur = Session::hasFlash('erreur_profil') ? Session::getFlash('erreur_profil') : null;

  $req = $db->prepare('
    SELECT u.use_id, u.use_nom, u.use_prenom, u.use_email, u.use_created_at, r.rru_label AS role
    FROM TOG_USERS u
    JOIN TOG_REF_ROLE_USER r ON u.use_role_id = r.rru_id
    WHERE u.use_id = ?
');
  $req->execute([Session::id()]);
  $user = $req->fetch();

  if (!$user) {
    echo '<p class="dash-empty">Impossible de charger le profil.</p>';
    return;
  }

  $initiales = strtoupper(mb_substr($user['use_prenom'], 0, 1) . mb_substr($user['use_nom'], 0, 1));
}catch (\Throwable $e){
  error_log("[Profile Error] " . $e->getMessage());

  http_response_code(500);

  echo "Erreur interne du serveur.";
  exit();
}

?>

<div class="profile-page">

  <!-- ── En-tête profil ── -->
  <div class="profile-header">
    <div class="profile-avatar"><?= htmlspecialchars($initiales) ?></div>
    <div class="profile-header-info">
      <h2><?= htmlspecialchars($user['use_prenom'] . ' ' . $user['use_nom']) ?></h2>
      <span class="profile-since"><?= htmlspecialchars($user['role']) ?></span>
      <span class="profile-since">
                Membre depuis le <?= htmlspecialchars(date('d/m/Y', strtotime($user['use_created_at']))) ?>
            </span>
    </div>
  </div>

  <?php if ($flash_succes): ?>
    <div class="profile-alert profile-alert--success">
      <i class="ti ti-circle-check" aria-hidden="true"></i>
      <?= htmlspecialchars($flash_succes) ?>
    </div>
  <?php endif; ?>

  <?php if ($flash_erreur): ?>
    <div class="profile-alert profile-alert--error">
      <i class="ti ti-alert-circle" aria-hidden="true"></i>
      <?= htmlspecialchars($flash_erreur) ?>
    </div>
  <?php endif; ?>

  <!-- ── Formulaire infos personnelles ── -->
  <div class="profile-block">
    <div class="profile-block-header">
      <h3><i class="ti ti-user" aria-hidden="true"></i> Informations personnelles</h3>
    </div>

    <form class="profile-form" method="POST" action="../api/updateProfile.php">

      <div class="profile-row-2">
        <div class="profile-field">
          <label for="prenom">Prénom</label>
          <input type="text" id="prenom" name="prenom"
                 value="<?= htmlspecialchars($user['use_prenom']) ?>" required>
        </div>
        <div class="profile-field">
          <label for="nom">Nom</label>
          <input type="text" id="nom" name="nom"
                 value="<?= htmlspecialchars($user['use_nom']) ?>" required>
        </div>
      </div>

      <div class="profile-field">
        <label for="email">Adresse e-mail</label>
        <input type="email" id="email" name="email"
               value="<?= htmlspecialchars($user['use_email']) ?>" required>
      </div>

      <button type="submit" class="profile-btn-save">
        <i class="ti ti-device-floppy" aria-hidden="true"></i>
        Enregistrer les modifications
      </button>

    </form>
  </div>

</div>

<script>
    document.getElementById('deleteAccountBtn').addEventListener('click', function() {
        if (confirm('Êtes-vous certain de vouloir supprimer votre compte ? Cette action est irréversible.')) {
            window.location.href = '../api/deleteAccount.php';
        }
    });
</script>

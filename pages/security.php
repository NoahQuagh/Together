<div class="profile-page">
  <div class="profile-block">
    <div class="profile-block-header">
      <h3><i class="ti ti-lock" aria-hidden="true"></i><?= __tphp('change password') ?></h3>
    </div>

    <form class="profile-form" method="POST" action="../api/updater/updatePassword.php">

      <div class="profile-field">
        <label for="mdp-actuel"><?= __tphp('current password') ?></label>
        <input type="password" id="mdp-actuel" name="mdp_actuel"
               placeholder="••••••••" autocomplete="current-password" required>
      </div>

      <div class="profile-row-2">
        <div class="profile-field">
          <label for="mdp-nouveau"><?= __tphp('new password') ?></label>
          <input type="password" id="mdp-nouveau" name="mdp_nouveau"
                 placeholder=<?= __tphp('minimum of 8 characters') ?> autocomplete="new-password"
                 minlength="8" required>
        </div>
        <div class="profile-field">
          <label for="mdp-confirm"><?= __tphp('confirm') ?></label>
          <input type="password" id="mdp-confirm" name="mdp_confirm"
                 placeholder="••••••••" autocomplete="new-password" required>
        </div>
      </div>

      <button type="submit" class="profile-btn-save">
        <i class="ti ti-key" aria-hidden="true"></i>
        <?= __tphp('update password') ?>
      </button>

    </form>
  </div>

  <div class="profile-block profile-block--danger">
    <div class="profile-block-header deleteacnt">
      <h3><i class="ti ti-alert-triangle" aria-hidden="true"></i><?= __tphp('sensitive area') ?></h3>
    </div>
    <div class="profile-danger-row">
      <div class="profile-danger-text">
        <span class="profile-danger-title"><?= __tphp('delete my account') ?></span>
        <span class="profile-danger-desc"><?= __tphp('this action is irreversible. all your projects and data will be permanently deleted') ?>.</span>
      </div>
      <button type="button" class="profile-btn-danger" id="deleteAccountBtn" onclick="openModal('supCompte')">
        <?= __tphp('delete my account') ?>
      </button>
    </div>
  </div>
</div>

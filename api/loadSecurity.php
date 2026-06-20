<div class="profile-page">
<!-- ── Formulaire changement de mot de passe ── -->
<div class="profile-block">
    <div class="profile-block-header">
        <h3><i class="ti ti-lock" aria-hidden="true"></i> Changer le mot de passe</h3>
    </div>

    <form class="profile-form" method="POST" action="../api/updatePassword.php">

        <div class="profile-field">
            <label for="mdp-actuel">Mot de passe actuel</label>
            <input type="password" id="mdp-actuel" name="mdp_actuel"
                   placeholder="••••••••" autocomplete="current-password" required>
        </div>

        <div class="profile-row-2">
            <div class="profile-field">
                <label for="mdp-nouveau">Nouveau mot de passe</label>
                <input type="password" id="mdp-nouveau" name="mdp_nouveau"
                       placeholder="8 caractères minimum" autocomplete="new-password"
                       minlength="8" required>
            </div>
            <div class="profile-field">
                <label for="mdp-confirm">Confirmer</label>
                <input type="password" id="mdp-confirm" name="mdp_confirm"
                       placeholder="••••••••" autocomplete="new-password" required>
            </div>
        </div>

        <button type="submit" class="profile-btn-save">
            <i class="ti ti-key" aria-hidden="true"></i>
            Mettre à jour le mot de passe
        </button>

    </form>
</div>

<!-- ── Zone danger ── -->
<div class="profile-block profile-block--danger">
    <div class="profile-block-header deleteacnt">
        <h3><i class="ti ti-alert-triangle" aria-hidden="true"></i> Zone sensible</h3>
    </div>
    <div class="profile-danger-row">
        <div class="profile-danger-text">
            <span class="profile-danger-title">Supprimer mon compte</span>
            <span class="profile-danger-desc">Cette action est irréversible. Tous vos projets et données seront supprimés définitivement.</span>
        </div>
        <button type="button" class="profile-btn-danger" id="deleteAccountBtn" onclick="supprimerCompte()">
            Supprimer mon compte
        </button>
    </div>
</div>
</div>
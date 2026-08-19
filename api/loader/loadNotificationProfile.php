<?php
//TODO a refaire
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../../includes/Session.php';

$db = getDB();

// ── Message flash après modification ────────────────
$flash_succes = Session::hasFlash('succes_pref') ? Session::getFlash('succes_pref') : null;
$flash_erreur = Session::hasFlash('erreur_pref') ? Session::getFlash('erreur_pref') : null;

// ── Préférences actuelles de l'utilisateur ───────────
$req = $db->prepare('
    SELECT
        p.tup_theme_id, th.rth_label AS theme_label,
        p.tup_langue,
        p.tup_notif_email,
        p.tup_notif_mention,
        p.tup_notif_assignation,
        p.tup_notif_commentaire,
        p.tup_vue_tache_id, vt.rvt_label AS vue_label
    FROM TOG_USER_PREFERENCES p
    JOIN TOG_REF_THEME th     ON p.tup_theme_id = th.rth_id
    JOIN TOG_REF_VUE_TACHE vt ON p.tup_vue_tache_id = vt.rvt_id
    WHERE p.tup_user_id = ?
');
$req->execute([Session::id()]);
$pref = $req->fetch();

// Si l'utilisateur n'a pas encore de ligne de préférences (cas rare), on insère valeurs défaut
if (!$pref) {
    $insertDefault = $db->prepare('INSERT INTO TOG_USER_PREFERENCES (tup_user_id) VALUES (?)');
    $insertDefault->execute([Session::id()]);

    $pref = [
        'tup_theme_id' => 3, 'theme_label' => 'systeme',
        'tup_langue' => 'fr',
        'tup_notif_email' => 1,
        'tup_notif_mention' => 1,
        'tup_notif_assignation' => 1,
        'tup_notif_commentaire' => 1,
        'tup_vue_tache_id' => 2, 'vue_label' => 'kanban',
    ];
}


$themes = $db->query('SELECT rth_id, rth_label FROM TOG_REF_THEME')->fetchAll();
$vues   = $db->query('SELECT rvt_id, rvt_label FROM TOG_REF_VUE_TACHE')->fetchAll();

?>

<div class="profile-page">

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

    <form method="POST" action="../updater/updatePreferences.php">

        <!-- ── Notifications ── -->
        <div class="profile-block">
            <div class="profile-block-header">
                <h3><i class="ti ti-bell" aria-hidden="true"></i> Notifications</h3>
            </div>

            <div class="profile-form pref-toggle-list">

                <label class="pref-toggle-row">
                    <div class="pref-toggle-text">
                        <span class="pref-toggle-title">Notifications par e-mail</span>
                        <span class="pref-toggle-desc">Recevoir un récapitulatif par e-mail</span>
                    </div>
                    <span class="pref-switch">
                        <input type="checkbox" name="notif_email" value="1" <?= $pref['tup_notif_email'] ? 'checked' : '' ?>>
                        <span class="pref-switch-slider"></span>
                    </span>
                </label>

                <label class="pref-toggle-row">
                    <div class="pref-toggle-text">
                        <span class="pref-toggle-title">Mentions</span>
                        <span class="pref-toggle-desc">Être notifié quand quelqu'un vous mentionne</span>
                    </div>
                    <span class="pref-switch">
                        <input type="checkbox" name="notif_mention" value="1" <?= $pref['tup_notif_mention'] ? 'checked' : '' ?>>
                        <span class="pref-switch-slider"></span>
                    </span>
                </label>

                <label class="pref-toggle-row">
                    <div class="pref-toggle-text">
                        <span class="pref-toggle-title">Assignations</span>
                        <span class="pref-toggle-desc">Être notifié quand une tâche vous est assignée</span>
                    </div>
                    <span class="pref-switch">
                        <input type="checkbox" name="notif_assignation" value="1" <?= $pref['tup_notif_assignation'] ? 'checked' : '' ?>>
                        <span class="pref-switch-slider"></span>
                    </span>
                </label>

                <label class="pref-toggle-row">
                    <div class="pref-toggle-text">
                        <span class="pref-toggle-title">Commentaires</span>
                        <span class="pref-toggle-desc">Être notifié des nouveaux commentaires sur vos tâches</span>
                    </div>
                    <span class="pref-switch">
                        <input type="checkbox" name="notif_commentaire" value="1" <?= $pref['tup_notif_commentaire'] ? 'checked' : '' ?>>
                        <span class="pref-switch-slider"></span>
                    </span>
                </label>

            </div>
        </div>

        <button type="submit" class="profile-btn-save">
            <i class="ti ti-device-floppy" aria-hidden="true"></i>
            Enregistrer les modifications
        </button>

    </form>

</div>

